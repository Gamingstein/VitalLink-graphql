import { prisma } from "../lib/db";
import { APIError, APIResponse, asyncResolver } from "../utils";

type SensorDataType = {
  sensorID: string;
  timestamp: Date;
  data: {
    bpm: number;
    temperature: number;
    oxygen: number;
  };
}[];

class SensorData {
  public static postSensorData = asyncResolver(async (req, res) => {
    const { sensordata } = req.body as { sensordata: SensorDataType };
    const data = await prisma.sensorData.createMany({
      data: sensordata,
    });
    if (!data) throw new APIError(400, "Sensor Data not created");
    return res
      .status(201)
      .json(new APIResponse(201, "Sensor Data created", data));
  });
}

export default SensorData;
