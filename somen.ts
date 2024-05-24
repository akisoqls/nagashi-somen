import { cursorTo } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/ansi_escapes.ts";
import { bamboo } from "./bamboo.ts";

export const generateStreamingSomen = (
  {
    banbooLength,
    banbooWidth,
    streamingSomen
  }: {
    banbooLength: number
    banbooWidth: number
    streamingSomen?: undefined 
  } | {
    banbooLength?: undefined
    banbooWidth?: undefined
    streamingSomen: boolean[][]
  }
) => {

  const makeSomenLine = (s: boolean[]) => {
    return s.map(isExistsSomen => {
      return isExistsSomen
        ? Math.random() < 0.97
        : Math.random() < 0.03;
    });
  }
  
  let somen: boolean[][] = [];

  if (streamingSomen) {

    somen = streamingSomen;
    const prevFrame = somen[0]
    const additionalSomen = makeSomenLine(prevFrame)
    somen.unshift(additionalSomen)
    somen.pop();

  } else {

    somen = [
      Array.from({ length: banbooWidth }, () => Math.random() < 0.5),
      ...Array.from({ length: banbooLength - 1 }, () => {
        return Array.from({ length: banbooWidth }, () => false)
      })
    ]

  }

  return somen;
}

export const generateSomenAA = (somens: boolean[][], withControlCharacters = true) => {
  let string = withControlCharacters ? cursorTo(0, 0) : "";
  somens = generateStreamingSomen({ streamingSomen: somens })
  let index = 0;
  for (const somen of somens) {

    const aaLineTemplate = bamboo[index];
    const [somenStart, somenWidth] = aaLineTemplate.somenArea;
    const somenToUse = somen.slice(0, somenWidth);
    const { template } = aaLineTemplate;

    const convertBooleanToSomen = somenToUse.map((isExistsSomen, charAt) => {
      return isExistsSomen ? aaLineTemplate.replacement : template.at(somenStart + charAt)
    }).join("");

    const somenOnBambooAA = template.slice(0, somenStart)
      + convertBooleanToSomen
      + template.slice(somenStart + convertBooleanToSomen.length);
    
    string += somenOnBambooAA;
    string += "\n";

    index++;
  }
  return string;
}