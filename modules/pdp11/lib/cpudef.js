/**
 * @fileoverview Defines PDP11 CPU constants.
 * @author <a href="mailto:Jeff@pcjs.org">Jeff Parsons</a>
 * @version 1.0
 * Created 2016-Sep-03
 *
 * This file is part of PCjs, a computer emulation software project at <http://pcjs.org/>.
 *
 * It has been adapted from the JavaScript PDP 11/70 Emulator v1.3 written by Paul Nankervis
 * (paulnank@hotmail.com) as of August 2016 from http://skn.noip.me/pdp11/pdp11.html.  This code
 * may be used freely provided the original author name is acknowledged in any modified source code.
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
 * that loads or runs any version of this software (see COPYRIGHT in /modules/shared/lib/defines.js).
 *
 * Some PCjs files also attempt to load external resource files, such as character-image files,
 * ROM files, and disk image files. Those external resource files are not considered part of PCjs
 * for purposes of the GNU General Public License, and the author does not claim any copyright
 * as to their contents.
 */

"use strict";

var CPUDefPDP11 = {
    /*
     * CPU model numbers (supported)
     */
    MODEL_1145: 1145,
    MODEL_1170: 1170,

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
        CF:     0x0001,         // bit 0: Carry Flag
        BIT1:   0x0002,         // bit 1: reserved, always set
        PF:     0x0004,         // bit 2: Parity Flag
        BIT3:   0x0008,         // bit 3: reserved, always clear
        AF:     0x0010,         // bit 4: Auxiliary Carry Flag
        BIT5:   0x0020,         // bit 5: reserved, always clear
        ZF:     0x0040,         // bit 6: Zero Flag
        SF:     0x0080,         // bit 7: Sign Flag
        ALL:    0x00D5,         // all "arithmetic" flags (CF, PF, AF, ZF, SF)
        MASK:   0x00FF,         //
        IF:     0x0200          // bit 9: Interrupt Flag (set if interrupts enabled; Intel calls this the INTE bit)
    },
    /*
     * Interrupt-related flags (stored in intFlags)
     */
    INTFLAG: {
        NONE:   0x0000,
        INTR:   0x00ff,         // mask for 8 bits, representing interrupt levels 0-7
        HALT:   0x0100          // halt requested; see opHLT()
    },
    /*
     * Opcode definitions
     */
    OPCODE: {
        HLT:    0x76,           // Halt
        ACI:    0xCE,           // Add with Carry Immediate (affects PS.ALL)
        CALL:   0xCD,           // Call
        RST0:   0xC7
        // to be continued....
    }
};

/*
 * These are the internal PS bits (outside of PS.MASK) that getPS() and setPS() can get and set,
 * but which cannot be seen with any of the documented instructions.
 */
CPUDefPDP11.PS.INTERNAL  =   (CPUDefPDP11.PS.IF);

/*
 * PS "arithmetic" flags are NOT stored in regPS; they are maintained across separate result registers,
 * hence the RESULT designation.
 */
CPUDefPDP11.PS.RESULT    =   (CPUDefPDP11.PS.CF | CPUDefPDP11.PS.PF | CPUDefPDP11.PS.AF | CPUDefPDP11.PS.ZF | CPUDefPDP11.PS.SF);

/*
 * These are the "always set" PS bits for the PDP11.
 */
CPUDefPDP11.PS.SET       =   (CPUDefPDP11.PS.BIT1);

if (NODE) module.exports = CPUDefPDP11;