import Base from "../structures/Base";

export interface ManagerClass<T extends Base> {
    class: T,
    name: string
}