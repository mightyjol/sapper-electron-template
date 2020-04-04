import { get } from 'svelte/store'
import { dist as settings, local as localSettings } from './settings.js'
import { store as inventories } from './inventories.js'
import { store as products } from './products.js'
import { store as tagSets } from './tags.js'
import { store as sizes } from './sizes.js'

async function init(client_id, db){
	let tempSettings = []
	let tempInventories = []
	let tempProducts = []
	let tempTags = []
	let tempSizes = []

	//todo get only settings if you have rights
	let settingsPromise = db.collection('settings').get()
	.then(query => {
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			tempSettings.push(data)
		})

		settings.set(tempSettings)
	})
	.catch(e => {
		console.error(e)
	})

	//todo get only inventories when you have read rights
	let inventoriesPromise = db.collection('inventories').get()
	.then(query => {
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			data.isPhysical = false

			let set = get(localSettings)
			if(set.inventories.indexOf(data.id) !== -1) data.isPhysical = true

			tempInventories.push(data)
		})

		inventories.set(tempInventories)
	})
	.catch(e => {
		console.error(e)
	})

	//load all products
	let productsPromise = db.collection('products').get()
	.then(query => {
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			
			if(!data.images) data.images = []
			tempProducts.push(data)
		})

		products.set(tempProducts)
	})
	.catch(e => {
		console.error(e)
	})

	//TODO merge tags and sizes set (similar shape, it should be possible)
	//load tag sets
	let tagsPromise = db.collection('tags').get()
	.then(async query => {
		let promises = []

		query.forEach(doc => {
			let dataSet = doc.data()
			dataSet.id = doc.id
			dataSet.labels = []

			let promise = db.collection('tags').doc(doc.id).collection('labels').get()
			.then(query => {
				query.forEach(doc => {
					let data = doc.data()
					data.id = doc.id 

					dataSet.labels.push(data)
				})

				tempTags.push(dataSet)
			})
			.catch(e => {
				console.error(e)
			})

			promises.push(promise)
		})

		await Promise.all(promises)
		.then(() => {
			tagSets.set(tempTags)
		})
	})
	.catch(e => {
		console.error(e)
	})

	//load sizes sets
	let sizesPromise = db.collection('sizes').get()
	.then(async query => {
		let promises = []
		query.forEach(doc => {
			let data = doc.data()
			data.id = doc.id
			data.labels = []

			let promise = db.collection('sizes').doc(doc.id).collection('labels').get()
			.then(query => {
				let i = 0
				query.forEach(doc => {
					let d = doc.data()
					d.id = doc.id 
					if(d.position == undefined) d.position = i++
					data.labels.push(d)
				})

				data.labels.sort((a, b) => a.position - b.position)
				tempSizes.push(data)
			})
			.catch(e => {
				console.error(e)
			})

			promises.push(promise)
		})

		await Promise.all(promises)
		.then(() => {
			sizes.set(tempSizes)
		})

	})
	.catch(e => {
		console.error(e)
	})
	
	await Promise.all([
		settingsPromise,
		inventoriesPromise,
		productsPromise,
		tagsPromise,
		sizesPromise
	])
	.then(() => {
		if(process.dev) console.log('loading finished')
	})
}

export default init