enum TableStatusEnum {
    AVAILABLE = "available",
    OCCUPIED = "occupied",
    RESERVED = "reserved",
  }
  
  export interface Table {
    id: string | null;
    userId: string;
    tableName: string;
    seatingCapacity: number;
    available: boolean;
  }
  
  export interface TableStatus {
    tableId: string;
    status: TableStatusEnum;
    updatedAt: Date;
  }
  