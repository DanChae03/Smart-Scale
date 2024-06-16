import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ReactElement, useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { Download } from "@mui/icons-material";
import { saveAs } from "file-saver";
import {
  AverageData,
  CityStatistics,
  WeightStatistic,
} from "../../utils/types";
import { LineChart } from "@mui/x-charts/LineChart";
import { Autocomplete, Box, Divider, Switch } from "@mui/material";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { ScatterValueType } from "@mui/x-charts";
import { StyledTextField } from "../../components/StyledTextField";
import { LanguageContext } from "../App";
import { API_URL } from "../../utils/dbUtils";
export function Statistics(): ReactElement {
  const [isAverageWeights, setIsAverageWeights] = useState<boolean>(true);
  const [statistics, setStatistics] = useState<CityStatistics[]>([]);
  const [averageData, setAverageData] = useState<AverageData | null>(null);
  const [scatterData, setScatterData] = useState<ScatterValueType[]>([]);
  const [totalData, setTotalData] = useState<CityStatistics | null>({
    cityName: "New Zealand",
    weights: [],
  });
  const [selectedCity, setSelectedCity] = useState<string>("Auckland");
  const [cities, setCities] = useState<string[]>([]);

  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const getStatistics = (): void => {
      fetch(`${API_URL}/api/statistics/weights-by-city`, {
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          parseData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getStatistics();
  }, []);

  useEffect(() => {
    calculateAverageData(statistics, selectedCity);
    calculateScatterData(statistics, selectedCity);
  }, [selectedCity, totalData]);

  const parseData = (data: any): void => {
    const statistics: CityStatistics[] = [];
    const cityNames: string[] = Object.keys(data);
    const dataCities: string[] = ["New Zealand"];
    cityNames.map((cityName) => {
      const weights: WeightStatistic[] = data[cityName].weightsByAge;
      statistics.push({
        cityName: capitalizeAndTrim(cityName),
        weights: weights,
      }) as CityStatistics;
      dataCities.push(capitalizeAndTrim(cityName));
    });
    setCities(dataCities);
    setSelectedCity(dataCities[0]);
    setStatistics(statistics);
    calculateAverageData(statistics, dataCities[0]);
    calculateScatterData(statistics, dataCities[0]);

    const months: number[] = new Array(61).fill(0);
    const weights: number[][] = [...Array(61)].map(() => []);

    Object.keys(data).forEach((city) => {
      data[city].weightsByAge.forEach(
        (monthData: { months: number; weights: number[] }) => {
          if (monthData.months != null && monthData.weights != null) {
            months[monthData.months] = monthData.months;
            weights[monthData.months] = weights[monthData.months].concat(
              monthData.weights
            );
          }
        }
      );
    });

    const filteredMonths = months.filter((month) => month != 0);
    const filteredWeights = weights.filter((weight) => weight.length != 0);
    if (filteredMonths.length + 1 == filteredWeights.length) {
      filteredMonths.unshift(0);
    }

    const allData: CityStatistics = { cityName: "New Zealand", weights: [] };
    filteredMonths.map((month, index) => {
      const weightStatistic: WeightStatistic = {
        months: month,
        weights: filteredWeights[index],
      };
      allData.weights?.push(weightStatistic);
    });
    setTotalData(allData);
  };

  const capitalizeAndTrim = (string: string) => {
    return (
      string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    ).replaceAll("_", " ");
  };

  const calculateScatterData = (statistics: CityStatistics[], city: string) => {
    let cityStatistics: CityStatistics | undefined | null = statistics.find(
      (city) => city.cityName === selectedCity
    );
    if (cityStatistics == null) {
      cityStatistics = totalData;
    }
    if (cityStatistics != null) {
      const scatterDots: ScatterValueType[] = [];
      cityStatistics.weights?.map((weightStat: WeightStatistic) => {
        weightStat.weights?.map((weight) => {
          if (weightStat.months != null) {
            scatterDots.push({
              x: weightStat.months,
              y: weight,
              id: `${weightStat.months} ${weight}`,
            });
          }
        });
      });
      setScatterData(scatterDots);
    }
  };

  const calculateAverageData = (statistics: CityStatistics[], city: string) => {
    let cityStatistics: CityStatistics | undefined | null = statistics.find(
      (city) => city.cityName === selectedCity
    );
    if (cityStatistics == null) {
      cityStatistics = totalData;
    }
    if (cityStatistics != null) {
      const weights: number[] = [];
      const months: number[] = [];
      cityStatistics.weights?.map((weight) => {
        if (weight.months != null && weight.weights != null) {
          months.push(weight.months);
          weights.push(average(weight.weights));
        }
      });
      setAverageData({ weights: weights, months: months } as AverageData);
    }
  };

  const average = (array: number[]) =>
    array.reduce((a, b) => a + b) / array.length;

  const getJSONData = (): void => {
    fetch(`${API_URL}/api/statistics/baby-data-json`, {
      credentials: "include",
      headers: {
        "Content-Type": "text/json",
      },
    })
      .then((response) => response.blob())
      .then((blob) => saveAs(blob, "baby-data.json"))
      .catch((error) => {
        console.error(error);
      });
  };

  const getCSVData = (): void => {
    fetch(`${API_URL}/api/statistics/baby-data-csv`, {
      credentials: "include",
      headers: {
        "Content-Type": "text/csv",
      },
    })
      .then((response) => response.blob())
      .then((blob) => saveAs(blob, "baby-data.csv"))
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Stack paddingX="80px" spacing="18px">
      <Typography variant="h3" sx={{ color: "primary.dark" }}>
        {language == "English" ? "Statistics" : "Tatauranga"}
      </Typography>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center">
          <Autocomplete
            value={selectedCity}
            options={cities}
            renderInput={(params) => (
              <StyledTextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  style: { fontWeight: "500" },
                }}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Typography fontWeight="500">{option}</Typography>
              </Box>
            )}
            onChange={(_event: any, newCity: string | null) => {
              if (newCity != null) {
                setSelectedCity(newCity);
              }
            }}
            sx={{ width: "350px", mr: "36px" }}
          />
          <Typography fontWeight="500">
            {language == "English" ? "Average Weight" : "Taumaha Toharite?"}
          </Typography>
          <Switch
            checked={isAverageWeights}
            onChange={(_event, newIsAverageWeights) => {
              setIsAverageWeights(newIsAverageWeights);
            }}
          />
        </Stack>
        <Stack direction="row" spacing="18px">
          <Button
            onClick={() => getJSONData()}
            variant="contained"
            sx={{
              px: "18px",
              borderRadius: "36px",
              color: "background.paper",
              "&:disabled": {
                bgcolor: "background.default",
              },
            }}
          >
            <Typography textTransform="none" fontWeight="500">
              {language == "English" ? "Export JSON" : "Kaweake JSON"}
            </Typography>
            <Download />
          </Button>
          <Button
            onClick={() => getCSVData()}
            variant="contained"
            sx={{
              px: "18px",
              borderRadius: "36px",
              color: "background.paper",
            }}
          >
            <Typography textTransform="none" fontWeight="500">
              {language == "English" ? "Export CSV" : "Kaweake CSV"}
            </Typography>
            <Download />
          </Button>
        </Stack>
      </Stack>
      <Divider />
      <Stack width="100%" alignItems="center">
        {isAverageWeights ? (
          <>
            {averageData != null && (
              <LineChart
                grid={{ vertical: true, horizontal: true }}
                yAxis={[
                  {
                    label:
                      language == "English"
                        ? "Average Weight (kg)"
                        : "Taumaha Toharite (kg)",
                    min: averageData?.weights?.length == 1 ? 0 : undefined,
                    max:
                      averageData?.weights?.length == 1
                        ? averageData.weights[0] * 2
                        : undefined,
                  },
                ]}
                xAxis={[
                  {
                    data: averageData.months,
                    label:
                      language == "English"
                        ? "Baby Age (Months)"
                        : "Tau Pepe (Marama)",
                    min: averageData?.months?.length == 1 ? 0 : undefined,
                    max:
                      averageData?.months?.length == 1
                        ? averageData.months[0] * 2
                        : undefined,
                  },
                ]}
                series={[
                  {
                    label: `${
                      language == "English"
                        ? "Average Baby Weights in"
                        : "Taumaha Pepi i"
                    } ${selectedCity}`,
                    data: averageData.weights,
                  },
                ]}
                margin={{ left: 80, right: 80, top: 50, bottom: 60 }}
                width={1300}
                height={550}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.85)",
                  fontSize: "25px",
                  "& .MuiChartsAxis-tickLabel tspan": {
                    fontSize: "16px",
                  },
                  "& .MuiChartsAxis-label tspan": {
                    fontSize: "21px",
                  },
                }}
              />
            )}
          </>
        ) : (
          <ScatterChart
            grid={{ vertical: true, horizontal: true }}
            yAxis={[
              {
                label:
                  language == "English"
                    ? "Baby Weight (kg)"
                    : "Pepe Taumaha (kg)",
                min: scatterData.length == 1 ? 0 : undefined,
                max: scatterData.length == 1 ? scatterData[0].y * 2 : undefined,
              },
            ]}
            xAxis={[
              {
                label:
                  language == "English"
                    ? "Baby Age (Months)"
                    : "Tau Pepe (Marama)",
                min: scatterData.length == 1 ? 0 : undefined,
                max: scatterData.length == 1 ? scatterData[0].x * 2 : undefined,
              },
            ]}
            width={1300}
            height={550}
            margin={{ left: 80, right: 80, top: 50, bottom: 60 }}
            series={[
              {
                label: `${
                  language == "English" ? "Baby Weights in" : "Taumaha Pepi i"
                } ${selectedCity}`,
                data: scatterData,
              },
            ]}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.85)",
              fontSize: "25px",
              "& .MuiChartsAxis-tickLabel tspan": {
                fontSize: "10px",
              },
              "& .MuiChartsAxis-label tspan": {
                fontSize: "21px",
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
}
