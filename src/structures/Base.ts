export default class Base {
    name: string;

    type?: string;
    private path?: string;

    constructor(name: string) {
        this.name = name;
    }

    setPath(value) {
        this.path = value;
    }

    getPath() {
        return this.path;
    }
}