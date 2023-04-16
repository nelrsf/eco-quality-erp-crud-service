import { PartialType } from "@nestjs/mapped-types";
import { Module } from "src/eqmodules/modules/entities/module.entity";


export class Table extends PartialType(Module) {}
