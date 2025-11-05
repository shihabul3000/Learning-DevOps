
//Linked List Implementation - Basic concept of Node 

class Node {
    constructor (value) {
        this.value  = value
        this.next = null;
    }
}

const head = new Node(10);

head.next = new Node(20);
head.next.next = new Node(20);


let temp = head ;

while(temp === null) {
    console.log(temp.value , " ");
    temp = temp.next
}