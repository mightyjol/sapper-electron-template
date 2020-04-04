import { writable } from 'svelte/store'
import { get } from 'svelte/store'

export let store =  writable([]);

export function autocomplete(value = ''){
	return []
}

//TODO refactor tagExists and getTagFromName
export function tagExists(value = undefined){
	if(value === undefined) return false

	let raw = get(store)
	let tags = []

	for(let set of raw){
		tags = [...tags, ...set.labels]
	}

	let tag = tags.findIndex(x => x.name.toLowerCase() === value.toLowerCase())
	
	return tag !== -1
}

export function getTagFromName(value){
	let raw = get(store)
	let tags = []

	for(let set of raw){
		tags = [...tags, ...set.labels]
	}

	let tag = tags.find(x => x.name.toLowerCase() === value.toLowerCase())
 
	return tag
}

export function getSetFromTagName(name){
	return get(store).find(x => {
		for(let label of x.labels){
			if(label.name == name) return true
		}
	})
}

export function tagCanBeAdded(tags, newTag){
	//checks if newTag is valid
	if(newTag == null || newTag == undefined) return false	
 	if(!tagExists(newTag.name)) return false

 	//checks if newTag is not already there
 	if(tags.indexOf() !== -1) return false

 	//checks if newTag conflicts with another tag already set
 	let set = getSetFromTagName(newTag.name)
 
 	for(let tag of tags){
 		let conflict = set.labels.findIndex(i => i.name == tag)
 		if(conflict !== -1) return false
 	}

 	//all is good
	return true
}