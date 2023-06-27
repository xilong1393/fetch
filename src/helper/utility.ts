export class Utility {
  sleep = (ms: any) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
}
