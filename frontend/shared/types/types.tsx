export type Task = {
    id: number;
    title: string;
};

export type Comment = {
    id: number;
    content: string;
    task_id?: number;
};