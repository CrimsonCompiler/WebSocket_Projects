import os from "os-utils";
import { ServerMetrics } from "../types";

export const getSystemMetrics = (
  callback: (metrics: ServerMetrics) => void,
) => {
  os.cpuUsage((cpuPercent: number) => {
    const metrics: ServerMetrics = {
      cpuUsage: (cpuPercent * 100).toFixed(2).toString(),
      freeMem: os.freemem().toFixed(2).toString() + " MB",
      totalMem: os.totalmem().toFixed(2).toString() + " MB",
    };
    callback(metrics);
  });
};
