import express, { Application } from "express";

export class Config {
    private app: Application;
    constructor(app: Application) {
        this.app = app
    }

    public setup() {
        this.app.use(express.json());
    }
}
