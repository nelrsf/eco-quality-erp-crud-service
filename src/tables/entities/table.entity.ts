import { PartialType } from "@nestjs/mapped-types";
import { Module } from "src/modules/entities/module.entity";


export class Table extends PartialType(Module) {}
