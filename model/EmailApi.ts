
export interface EmailApi {
    createBatch(): number;
    queueEmail(batchId: number, email: string, subject: string, body: string): void;
    flushBatch(batchId: number): Promise<void>;
}