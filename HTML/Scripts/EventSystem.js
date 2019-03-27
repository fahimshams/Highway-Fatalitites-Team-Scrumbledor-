'use strict'

// Singleton (accessed via EventSystem.Instance) for managing generic event firing.
// Event callbacks have two properties, self and func.  self is the 'this' stored
// for that callback, func is the function to be called.
// When firing an event, you can specify whether a listener is required or not for
// debugging purposes.
// Functions for events can take a single parameter.  If you need your function
// to receive multiple parameters, bundle them inside an object.  For example,
// if you needed to pass the parameters color, speed, and year to a function
// listening for an event, you would package them into an object as follows:
//
// let param = {
// 		color: "red",
//		speed: 60,
//		year: 2019
// }
//
// And then raise the event as follows:
// EventSystem.Instance.RaiseEvent("MyEvent", param)
//
// As a word of warning, keep in mind that you should never change the contents of
// that param object in any of the callback functions, as it is a reference and
// changing it will affect it's contents for all other listeners listening for that
// event.
class EventSystem
{
	static get Instance()
	{
		return instance;
	}

	constructor()
	{
		this.eventMap = new Map();
	}

	// Add a new listener for a particular event name.  
	// Params:
	//		eventName: The name of the event to listen for.
	//		self: The 'this' variable that should be used to call the function.
	//		func: The function that should be called.
	AddListener(eventName, self, func)
	{
		// Get the event data from the map.
		let callbackData = this.eventMap.get(eventName);
		if (callbackData == undefined)
		{
			// If no data was found, this event doesn't exist yet.  Make an
			// array to store callback data and add it to the map.
			callbackData = [];
			this.eventMap.set(eventName, callbackData);
		}

		// Generate the new callback data.
		let newCallback = {
			self: self,
			func: func
		};

		// Push the new callback to the array.
		callbackData.push(newCallback);
	}

	// Remove an existing listener from a particular event.  If nothing using the
	// given 'this' and function is listening for the specified event, an error
	// is logged.
	// Params:
	//		eventName: The name of the event to stop listening for.
	//		self: The 'this' variable set for the function.
	//		func: The function that would be called.
	RemoveListener(eventName, self, func)
	{
		// Get event data.
		let callbackData = this.eventMap.get(eventName);
		if (callbackData == undefined)
		{
			// No event data found for this event, log error.
			console.error("[EventSystem::RemoveListener] No event named '" + eventName + "' has any listeners.");
			return;
		}

		// Search the event data for the specified callback.
		for (let i = 0; i < callbackData.length; i++)
		{
			let data = callbackData[i];
			if (data.self == self && data.func == func)
			{
				// Found it, remove it from the array.
				callbackData.splice(i, 1);

				// If array is now empty, remove the event from the map.
				if (callbackData.length == 0)
				{
					this.eventMap.delete(eventName);
				}

				return;
			}
		}

		// If we've gotten here no event data matching the parameters was found.
		console.error("[EventSystem::RemoveListener] No callback for event '" + eventName + "' was found matching passed parameters.");
	}

	// Raises an event.  If requireListener is true, then an error will be logged
	// if there are no listeners for that event.
	RaiseEvent(eventName, argsObject, requireListener = false)
	{
		// Get event data.
		let callbackData = this.eventMap.get(eventName);
		if (callbackData == undefined)
		{
			// No listeners for this event.
			if (requireListener)
			{
				console.error("[EventSystem::RaiseEvent] No listeners for event '" + eventName + "'.");
			}

			return;
		}
		
		// Call the callbacks.
		for (let i = 0; i < callbackData.length; i++)
		{
			let data = callbackData[i];
			data.func.call(data.self, argsObject);
		}
	}
}

var instance = new EventSystem();