export default class Layer {
    id: number;
    value: string;
    name: string;

    constructor(id: number, value: string, name: string) {
        this.id = id;
        this.value = value;
        this.name = name;
    }
}
