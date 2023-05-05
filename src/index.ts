import { execSync, spawnSync } from "child_process";
import prompts from "prompts";
import { parseIwlistOutput } from "./parse";
import { Cell, ParsedCell } from "./types";

entrypoint();

async function entrypoint() {
  const _interface = "wlan0";
  const proc = spawnSync("iwlist", [_interface, "scan"]);

  const data = proc.stdout.toString("utf8");
  const parsed = parseIwlistOutput(data);

  const cells: Cell[] = parsed.map(toCell)
    .filter((c) => c.essid.length > 0)
    .sort((a, b) => {
      const q = b.quality - a.quality;
      if (q !== 0) return q;

      return b.frequency - a.frequency;
    });

  const questions: prompts.PromptObject<string>[] = [
    {
      type: "select",
      name: "ap",
      message: "Proposal: select an access point",
      choices: cells.map((cell) => ({ title: format(cell), value: cell })),
    },
    {
      type: "password",
      name: "password",
      message: "Request: password (optional)",
    },
  ];

  const response = await prompts(questions);
  const cell: Cell | undefined = response.ap;
  if (!cell) return;

  cell.password = response.password;

  try {
    execSync(cell.commands[0]);
  } catch (error) {}

  for (const cmd of cell.commands.slice(1)) {
    try {
      execSync(cmd.replace("<password>", cell.password || ""));
    } catch (error) {
      console.error(error);
      break;
    }
  }
}

function toCell(pc: ParsedCell) {
  let essid = pc.essid || '""';
  essid = essid.substring(1, essid.length - 1);

  let qualityString = pc.quality || "0/70";
  qualityString = qualityString.substring(0, qualityString.length - 3);

  let quality = Math.round((Number.parseInt(qualityString) / 70) * 100);

  let frequencyString = pc.frequency || "2";

  const cell: Cell = {
    essid,
    address: pc.address || "",
    quality,
    frequency: Number.parseInt(frequencyString[0]),
    commands: [],
  };

  cell.commands.push(
    `nmcli c delete "${essid}"`,
  );
  cell.commands.push(
    `nmcli device wifi connect "${essid}" password <password>`,
  );
  cell.commands.push(
    `nmcli c modify "${essid}" 802-11-wireless.bssid "${cell.address}"`,
  );
  cell.commands.push(
    `nmcli c up "${essid}"`,
  );

  return cell;
}

function format(cell: Cell) {
  return `${cell.essid} | ${cell.frequency}Ghz | Strength: ${cell.quality}%`;
}
