/**
 * @fileoverview Defines PC8080 constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Apr-18
 *
 * Copyright © 2012-2016 Jeff Parsons <Jeff@pcjs.org>
 *
 * This file is part of PCjs, which is part of the JavaScript Machines Project (aka JSMachines)
 * at <http://jsmachines.net/> and <http://pcjs.org/>.
 *
 * PCjs is free software: you can redistribute it and/or modify it under the terms of the
 * GNU General Public License as published by the Free Software Foundation, either version 3
 * of the License, or (at your option) any later version.
 *
 * PCjs is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 * even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with PCjs.  If not,
 * see <http://www.gnu.org/licenses/gpl.html>.
 *
 * You are required to include the above copyright notice in every source code file of every
 * copy or modified version of this work, and to display that copyright notice on every screen
 * that loads or runs any version of this software (see Computer.COPYRIGHT).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of the
 * PCjs program for purposes of the GNU General Public License, and the author does not claim
 * any copyright as to their contents.
 */

"use strict";

var CPUDef = {
    /*
     * CPU model numbers (supported)
     */
    MODEL_8080: 8080,

    /*
     * This constant is used to mark points in the code where the physical address being returned
     * is invalid and should not be used.
     *
     * In a 32-bit CPU, -1 (ie, 0xffffffff) could actually be a valid address, so consider changing
     * ADDR_INVALID to NaN or null (which is also why all ADDR_INVALID tests should use strict equality
     * operators).
     *
     * The main reason I'm NOT using NaN or null now is my concern that, by mixing non-numbers
     * (specifically, values outside the range of signed 32-bit integers), performance may suffer.
     *
     * WARNING: Like many of the properties defined here, ADDR_INVALID is a common constant, which the
     * Closure Compiler will happily inline (with or without @const annotations; in fact, I've yet to
     * see a @const annotation EVER improve automatic inlining).  However, if you don't make ABSOLUTELY
     * certain that this file is included BEFORE the first reference to any of these properties, that
     * automatic inlining will no longer occur.
     */
    ADDR_INVALID: -1,

    /*
     * Processor Status flag definitions (stored in regPS)
     */
    PS: {
        CF:     0x0001,         // bit 0: Carry flag
        BIT1:   0x0002,         // bit 1: reserved, always set
        PF:     0x0004,         // bit 2: Parity flag
        BIT3:   0x0008,         // bit 3: reserved, always clear
        AF:     0x0010,         // bit 4: Auxiliary Carry flag
        BIT5:   0x0020,         // bit 5: reserved, always clear
        ZF:     0x0040,         // bit 6: Zero flag
        SF:     0x0080,         // bit 7: Sign flag
        ALL:    0x00D5,         // CF, PF, AF, ZF, SF
        MASK:   0x00FF,         //
        IF:     0x0200,         // bit 9: Interrupt flag (for internal use only)
        OF:     0x0800          // bit 11: Overflow flag (for internal use only)
    },
    RESULT: {
        /*
         * Flags are computed using the following internal registers:
         *
         *      CF: resultZeroCarry & resultSize (ie, 0x100 or 0x10000)
         *      PF: resultParitySign & 0xff
         *      AF: (resultParitySign ^ resultAuxOverflow) & 0x0010
         *      ZF: resultZeroCarry & (resultSize - 1)
         *      SF: resultParitySign & (resultSize >> 1)
         *      OF: (resultParitySign ^ resultAuxOverflow ^ (resultParitySign >> 1)) & (resultSize >> 1)
         */
        SIZE_BYTE:  0x00100,    // mask for byte arithmetic instructions (after subtracting 1)
        SIZE_WORD:  0x10000,    // mask for word arithmetic instructions (after subtracting 1)
        AUXOVF_AF:  0x00010,
        AUXOVF_OF:  0x08080,
        AUXOVF_CF:  0x10100
    },
    PARITY:  [                  // 256-byte array with a 1 wherever the number of set bits of the array index is EVEN
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0,
        1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1
    ],
    /*
     * Bit values for opFlags, which are all reset to zero prior to each instruction
     */
    OPFLAG: {
        NOREAD:     0x0001,     // disable memory reads for the remainder of the current instruction
        NOWRITE:    0x0002,     // disable memory writes for the remainder of the current instruction
        NOINTR:     0x0004      // a segreg has been set, or a prefix, or an STI (delay INTR acknowledgement)
    },
    /*
     * Bit values for intFlags
     */
    INTFLAG: {
        NONE:       0x00,
        INTR:       0x01,       // h/w interrupt requested
        HALT:       0x04        // halt (HLT) requested
    },
    /*
     * Opcode definitions
     */
    OPCODE: {
        ACI:    0xCE,           // PS.ALL
        CALL:   0xCD
        // to be continued....
    },
    CYCLES: {
        ACI:    7               // 2 cycles, 7 states
        // to be continued....
    }
};

/*
 * Some PS flags are stored directly in regPS, hence the "direct" designation.
 */
CPUDef.PS.DIRECT    =   (CPUDef.PS.IF);

/*
 * However, PS "arithmetic" flags are NOT stored in regPS; they are maintained across
 * separate result registers, hence the "indirect" designation.
 */
CPUDef.PS.INDIRECT  =   (CPUDef.PS.CF | CPUDef.PS.PF | CPUDef.PS.AF | CPUDef.PS.ZF | CPUDef.PS.SF | CPUDef.PS.OF);

/*
 * These are the default "always set" PS bits for the 8080.
 */
CPUDef.PS.SET       =   (CPUDef.PS.BIT1);

if (NODE) module.exports = CPUDef;
