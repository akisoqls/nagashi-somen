type AA = string;
type charAt = number;
type areaWidth = number;
type somenArea = [charAt, areaWidth];
type streamingSomenTemplate = {
  template: AA,
  somenArea: somenArea,
  replacement: string
};


export const bamboo: streamingSomenTemplate[] = [
  {template: "            //                //  0  /", somenArea:[23, 7], replacement: "▞"},
  {template: "           //                //  000/ ", somenArea:[22, 7], replacement: "▞"},
  {template: "          //                //   | |  ", somenArea:[21, 7], replacement: "▞"},
  {template: "         //                //    | |  ", somenArea:[20, 7], replacement: "▞"},
  {template: "        /|                 \\\\    | |  ", somenArea:[19, 8], replacement: "▞"},
  {template: "        \\|                  \\\\  /| |  ", somenArea:[18, 10], replacement: "▞"},
  {template: "         \\\\                 || / | |  ", somenArea:[17, 11], replacement: "▞"},
  {template: "          \\'､               /|/  | |  ", somenArea:[15, 12], replacement: "▞"},
  {template: "          |;､\\_____________//\"   | |  ", somenArea:[14, 13], replacement: "▞"},
  {template: "          |||¯¯¯¯¯¯¯¯¯¯¯¯¯¯\"     | |   ", somenArea:[14, 13], replacement: "❚"},
  {template: "          |||  _                 | |  ", somenArea:[14, 13], replacement: "❚"},
  {template: "          ||| //                /| |  ", somenArea:[14, 13], replacement: "❚"},
  {template: "          |||//|               //| |\\ ", somenArea:[14, 13], replacement: "❚"},
  {template: "          ||//  \\             // | || ", somenArea:[14, 13], replacement: "❚"},
  {template: "          |//    \\           //  000/ ", somenArea:[14, 13], replacement: "❚"},
  {template: "          //      '､________//    0/ ", somenArea: [14, 12], replacement: "❚"},
  {template: "        ／/                / |    /  ", somenArea:[13, 13], replacement: "❚"},
  {template: "       | /                //／   /   ", somenArea:[14, 12], replacement: "❚"},
  {template: "       //                //      |   ", somenArea:[14, 11], replacement: "❚"},
  {template: "      //                //     _ノ    ", somenArea:[14, 10], replacement: "❚"},
  {template: "     //                //     /       ", somenArea:[14, 9], replacement: "❚"},
  {template: "    //                //     /        ", somenArea:[14, 8], replacement: "❚"},
  {template: "   //                //     /         ", somenArea:[14, 7], replacement: "❚"},
  {template: "  //                // 0   /          ", somenArea:[13, 7], replacement: "▞"},
  {template: " //                // 000 /           ", somenArea:[12, 7], replacement: "▞"},
  {template: "//                //  | |/            ", somenArea:[11, 7], replacement: "▞"},
];