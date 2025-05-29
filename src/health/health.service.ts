import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  private isReady = false;

  setReady(ready: boolean) {
    this.isReady = ready;
  }

  getStatus() {
    return {
      ok: this.isReady,
      status: this.isReady ? "ready" : "initializing",
    };
  }
}
