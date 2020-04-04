import { writable } from 'svelte/store'

export let local = writable({})
export let dist = writable({})