export interface ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;
    errors?: any[]; // present only in case of failure
  }
  