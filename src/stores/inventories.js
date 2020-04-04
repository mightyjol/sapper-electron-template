import { writable } from 'svelte/store'
import { local as localSettings } from './settings'

export function addPhysicalInventory(id){
	ipc.send('physical-inventory-add', { id: id })
}

export function removePhysicalInventory(id){
	ipc.send('physical-inventory-remove', { id: id })
}

export let store =  writable([]);