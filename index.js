import ps1NtscJ from "./ps1/ntsc-j.json" assert { type: "json" };
import ps1NtscUc from "./ps1/ntsc-uc.json" assert { type: "json" };
import ps1Pal from "./ps1/pal.json" assert { type: "json" };
import ps2NtscJ from "./ps2/ntsc-j.json" assert { type: "json" };
import ps2NtscUc from "./ps2/ntsc-uc.json" assert { type: "json" };
import ps2Pal from "./ps2/pal.json" assert { type: "json" };
import pspNtscJ from "./psp/ntsc-j.json" assert { type: "json" };
import pspNtscUc from "./psp/ntsc-uc.json" assert { type: "json" };
import pspPal from "./psp/pal.json" assert { type: "json" };

export default {
  ps1: {
    "ntsc-j": { index: ps1NtscJ },
    "ntsc-uc": { index: ps1NtscUc },
    pal: { index: ps1Pal },
  },
  ps2: {
    "ntsc-j": { index: ps2NtscJ },
    "ntsc-uc": { index: ps2NtscUc },
    pal: { index: ps2Pal },
  },
  psp: {
    "ntsc-j": { index: pspNtscJ },
    "ntsc-uc": { index: pspNtscUc },
    pal: { index: pspPal },
  },
};
