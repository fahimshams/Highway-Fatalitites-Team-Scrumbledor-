class DeferredStart
{
	TryInitialize()
	{
		if (FatalityData.Instance.DataReady)
		{
			this.Initialize();
		}
		else
		{
			EventSystem.Instance.AddListener("SystemReady", this, this.Initialize);
		}
	}

	Initialize()
	{
		console.log("Implement an initialize function in your child class.");
	}
}