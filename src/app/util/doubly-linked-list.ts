export class DoublyLinkedList<T> {
    private size = 0;
    private head?: Node<T>;
    private tail?: Node<T>;

    append(value: T | Node<T>): void {
        let node;
        if (!(value instanceof Node)) {
            node = new Node(value);
        } else {
            node = value;
        }
        if (this.size === 0) {
            this.head = node;
            this.tail = node;
            this.linkTailAndHead();
        } else {
            // @ts-ignore
            this.tail.next = node;
            node.prev = this.tail;
            this.tail = node;
            this.linkTailAndHead();
        }
        this.size++;
    }

    remove(node: Node<T>): void {
        // handling the last item in the list
        if (node === this.tail && node === this.head) {
            this.tail.next = undefined;
            this.tail.prev = undefined;
            this.tail = undefined;
            this.head = undefined;
        }

        const prevNode = node.prev;
        const nextNode = node.next;

        if (prevNode !== undefined) {
            prevNode.next = nextNode;
        }
        if (nextNode !== undefined) {
            nextNode.prev = prevNode;
        }
        if (this.tail === node) {
            this.tail = prevNode;
        }
        if (this.head === node) {
            this.head = nextNode;
        }
        this.size--;
    }

    *iterate(): Generator<Node<T>> {
        let node = this.head;
        while (node instanceof Node) {
            yield node;
            node = node.next;
        }
    }

    private linkTailAndHead(): void {
        if (this.tail === undefined || this.head === undefined) {
            throw new Error('Tail or Head empty');
        }
        this.tail.next = this.head;
        this.head.prev = this.tail;
    }
}

export class Node<T> {
    value: T;
    next?: Node<T>;
    prev?: Node<T>;

    constructor(value: T) {
        this.value = value;
    }
}
