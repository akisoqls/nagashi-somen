import { cursorTo } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/ansi_escapes.ts";
import { colors } from "https://deno.land/x/cliffy@v1.0.0-rc.4/ansi/colors.ts";
import { bamboo } from "./bamboo.ts";

type SomenColor = 82 | 219; // #8EFC4D | #F2B1F9
type somen = {
  isSomen: true;
  position: number;
  color?: SomenColor;
} | {
  isSomen: false;
};

const backgroundColor = 22; // #275D16

export const generateStreamingSomen = (
  {
    somenLength = 20,
    banbooLength,
    banbooWidth,
    streamingSomen,
  }: {
    somenLength: number;
    banbooLength: number;
    banbooWidth: number;
    streamingSomen?: undefined;
  } | {
    somenLength: number;
    banbooLength?: undefined;
    banbooWidth?: undefined;
    streamingSomen: somen[][];
  },
) => {
  const makeSomenLine = (s: somen[]): somen[] => {
    return s.map<somen>((prevSomen) => {
      let currentSomen: somen = {
        isSomen: false,
      };
      const isSomen = prevSomen.isSomen
        ? Math.random() * (somenLength - prevSomen.position) > 0.1
        : Math.random() < 0.02;
      if (isSomen) {
        if (prevSomen.isSomen) {
          currentSomen = {
            isSomen,
            position: prevSomen.position + 1,
            color: prevSomen.color,
          };
          return currentSomen;
        } else {
          const isWithColor = Math.random() < 0.06;
          return {
            isSomen,
            position: 0,
            ...(
              isWithColor ? { color: getSomenColor() } : {}
            ),
          };
        }
      } else {
        return {
          isSomen,
        };
      }
    });
  };

  let somen: somen[][] = [];

  if (streamingSomen) {
    somen = streamingSomen;
    const prevSomen = somen[0];
    const additionalSomen = makeSomenLine(prevSomen);
    somen.unshift(additionalSomen);
    somen.pop();
  } else {
    somen = [
      Array.from({ length: banbooWidth }, () => {
        const isSomen = Math.random() < 0.08;
        if (isSomen) {
          return {
            isSomen: true,
            position: 0,
          };
        } else {
          return { isSomen };
        }
      }),
      ...Array.from({ length: banbooLength - 1 }, () => {
        return Array.from({ length: banbooWidth }, () => {
          return { isSomen: (false as false) };
        });
      }),
    ];
  }

  return somen;
};

export const generateSomenAA = (
  somens: somen[][],
  withControlCharacters = true,
) => {
  let string = withControlCharacters ? cursorTo(0, 0) : "";
  somens = generateStreamingSomen({ streamingSomen: somens, somenLength: 30 });
  let index = 0;
  for (const somen of somens) {
    const aaLineTemplate = bamboo[index];
    const [somenStart, somenWidth] = aaLineTemplate.somenArea;
    const somenToUse = somen.slice(0, somenWidth);
    const { template } = aaLineTemplate;
    const convertBooleanToSomen = somenToUse.map((targetSomen, charAt) => {
      const { isSomen: isExistsSomen } = targetSomen;
      if (isExistsSomen) {
        const { color } = targetSomen;
        return color
          ? colors.rgb8(aaLineTemplate.replacement, color)
          : aaLineTemplate.replacement;
      } else {
        return template.at(somenStart + charAt);
      }
    }).join("");

    const somenOnBambooAA = template.slice(0, somenStart) +
      convertBooleanToSomen +
      template.slice(somenStart + somenWidth);
    string += somenOnBambooAA;
    string += "\n";
    string = colors.brightWhite(string);

    index++;
  }
  string = colors.bgRgb8(string, backgroundColor);
  return string;
};

const getSomenColor = (): SomenColor => {
  return Math.floor(Math.random() * 2) ? 219 : 82;
};
