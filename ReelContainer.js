ReelContainer = function (params)
{
	this.construct(params);
	
	this.numberOfReels = typeof params.numberOfReels === "number" ? params.numberOfReels : 3;
	this.iconRatio = typeof params.iconRatio === "number" ? params.iconRatio : 1;
	this.reelSpacing = params.width / this.numberOfReels;
	this.spinning = false;

	this.reels = [];

	this.init();

	CMP.App.addUpdate(this.update.bind(this));

};

ReelContainer.prototype =
{
	init: function()
	{

		this.blurA = this.addChild(new CMP.Sprite({
			image:"blurA",
			x:250,
			y:15,
			scaleX:0.95,
			scaleY:0.95
		}));
		this.reelBG = this.addChild(new CMP.Sprite({
			image:"reelBG",
			x:250,
			y:215,
			scaleX:0.95,
			scaleY:0.95
		}));
		this.reelContainers = this.addChild(new CMP.DisplayObjectContainer("fill"));
		this.reelContainers.x = -45;
		this.reelContainers.y = 25;
		this.reelContainers.scaleX = this.reelContainers.scaleY = 1.175;



		let numInitialTicks = [2,4,6,8,10];
		for(var i = 0; i < this.numberOfReels; i++)
		{
			let a = this.reelContainers.addChild(new Reel({
				//backgroundColor: i%2==0?"#070":"#007",
				x:i*this.reelSpacing,
				width:this.reelSpacing,
				height:this.height,
				iconRatio:this.iconRatio,
				initialTicks:numInitialTicks[i]
			}))
			this.reels.push(a);	
		}
		this.jackpotField = this.addChild(new CMP.Sprite({
			image:"jackpotField",
			x:250,
			y:0,
			scaleX:0.45,
			scaleY:0.45
		}));

		this.hyperText = this.addChild(new CMP.Text({
			text:"18,999,888,000",
			font:"32px Arial",
			color:"#fff",
			x:175,
			y:-40
		}));	
		this.megaText = this.addChild(new CMP.Text({
			text:"1,299,888,000",
			font:"28px Arial",
			color:"#fff",
			x:175,
			y:-11
		}));	
		this.miniText = this.addChild(new CMP.Text({
			text:"499,888,000",
			font:"24px Arial",
			color:"#fff",
			x:175,
			y:17
		}));

		this.jackpotTierFrame = this.addChild(new CMP.Sprite({
			image:"jackpotTierFrame",
			x:250,
			y:-26,
			scaleX:0.44,
			scaleY:0.44
		}));
		this.jackpotTiers = this.addChild(new CMP.Sprite({
			image:"jackpotTiers",
			x:125,
			scaleX:0.44,
			scaleY:0.44
		}));

		this.bodyFrame = this.addChild(new CMP.Sprite({
			image:"bodyFrame",
			x:250,
			y:215,
			scaleX:0.45,
			scaleY:0.45
		}));
	},

	spin: function(numTicks)
	{
		for(let i = 0; i < this.reels.length; i++)
		{
			CMP.PerformAction({
				action:this.spinReel.bind(this,i),
				delay:0.1*i
			});
		}
		CMP.PerformAction({
			action:this.finishedSpinning.bind(this,i),
			delay:4.5
		});
	},

	spinReel: function(i)
	{
		let numTicks = [22,26,28,29,32];
		this.reels[i].spin(numTicks[i]);
	},

	update: function({delta})
	{
		// Test 1:
		// Delta is in milliseconds	
		//this.megaText.text = '0';
		
		// Takes previous value of each score and adds it to a new random number
		// random numbers are decided in the randomNumber() function.
		// Scores need must be presented in string format, so they're converted to int for arithmatic. 
		// Then back to string for display.
		var countHolder;
		var timePastVar = ((delta)%500);

		if(timePastVar > countHolder){
			var intHyperText = (Number(hyperText) + (randomNumber(70,100)));
			var intMegaText = (Number(megaText) + (randomNumber(20,30)));
			var intMiniText = (Number(miniText) + (randomNumber(3,5)));


			this.hyperText.text = intHyperText.toString();
			this.megaText.text = intMegaText.toString();
			this.miniText.text = intMiniText.toString();

			countHolder = timePastVar;
		}


	},

	randomNumer: function(bottom,top)
	{
		//Takes input of two variables, for range of random number.
		//top is how high the number can go, bottom is how low it can go.
		return Math.floor(Math.random() * top) + bottom;
	},

	finishedSpinning: function()
	{
		//Test 2:

		var slotIcons = [
		['bar','cherry','seven','barDouble','bar'],
		['bar','seven','barDouble','bar','cherry'],
		['bar','barDouble','bar','cherry','seven'],
		['cherry','seven','barDouble','bar','bar'],
		['seven','barDouble','bar','bar','cherry']
		];

		var winners = [0,0,0,0,0];

		this.spinning = false;
		for(let i = 0; i < this.reels.length; i++)
		{
			for(let j = 0; j < this.reels[i].slotIcons.length; j++)
			{
				//Outputs all the reel icon names at the end of spinning
				console.log(this.reels[i].slotIcons[j].getImage());

				if(i > 2){					
					//if Icon matches previous 2 in line it is success
					//if found to be successful we mark the winning line for print later.
					if(this.reels[i].slotIcons[j] == this.reels[(i-1)].slotIcons[j] == this.reels[(i-2)].slotIcons[j]) {
						winners[j] = i;

					}

				}
			}
		}

		for(let i = 0; i < this.winners.length; i++)
		{
			//Scans winners array and prints out corresponding line To show.
			if(winners[i] != 0){
				for(let j = 0; j < this.reels[i].length; j++){

					// Scales up winning three icons. 
					if((j == (winners[i])) | (j == (winners[i]-1)) | (j == (winners[i]-2))) {
						// Sends icon coordinates to scaleUp function.
						this.scaleUp(reels[i],slotIcons[j]);
					}

					console.log(this.reels[i].slotIcons[j].getImage());

				}

				console.log("\n");
			}

		}
	},

	scaleUp: function(x, y){
		// Enlarging logic for applicable icons.
		// Not exactly sure how scaling icons works. 
		// But I think my logic for getting to this function is sound.


	},

	layout: {
		xPercentage:0.5,
		yPercentage:0.5,
		scaleToWidth:0.5,
		scaleToHeight:1
	}
};
extend("ReelContainer", "CMP.DisplayObjectContainer");