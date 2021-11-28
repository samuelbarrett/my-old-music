class List<E> {
	private _head: ListNode<E> | null = null
	private _length: Number = 0

	constructor(head?: ListNode<E>) {
		this._head = head || null
	}
	get head(): ListNode<E> | null {
		return this._head
	}
	get length(): Number { return this._length }

	get iterator(): ListIterator<E> {
		return new ListIterator(this._head)
	}
	insert(data: E) {
		if(this._head == null) {
			this._head = new ListNode<E>(data, null)
		} else {
			this._head = new ListNode<E>(data, this._head)
		}
	}
	append(data: E) {
		if(this._head == null) {
			this._head = new ListNode<E>(data, null)
		} 
		else {
			let current: ListNode<E> = this._head
			while(current.next != null) {
				current = current.next
			}
			current.nextNode = new ListNode<E>(data, null)
		}
	}
}

class ListNode<E> {
	private _element
	public nextNode: ListNode<E> | null

	constructor(elem: E, next: ListNode<E> | null) {
		this._element = elem
		this.nextNode = next
	}
	get element(): E {
		return this._element
	}
	get next(): ListNode<E> | null {
		return this.nextNode
	}
}

class ListIterator<E> {
	private _head: ListNode<E> | null = null
	private _current: ListNode<E> | null = null

	constructor(head: ListNode<E> | null) {
		this._head = head
		this._current = this._head
	}
	get next(): E | null {
		var result = null
		if(this._current != null) {
			result = this._current.element
			this._current = this._current.next
		}
		return result
	}
	get hasNext(): boolean {
		return this._current != null
	}
}