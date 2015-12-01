var
	snowingEls={},
	snowflakes=[],
	minSize=10,
	maxSize=30,
	speed=1,
	vspeed=speed/2,
	hspeed=3;

function snow(el,nFlakes)
{
	if(typeof snowingEls[el.id]==='undefined')
		snowingEls[el.id]={
			curFlakes: 0,
		};
	snowingEls[el.id].nFlakes=nFlakes;
	snowingEls[el.id].lowestFlake=0;
	if(nFlakes) new Snowflake(el);
}

setInterval(
	function()
	{
		moveFlakes();
		addFlakes();
		renderFlakes();
	},
	50
);
function Snowflake(el)
{
	this.el=el;
	this.flakeEl=document.createElement('div');
	el.appendChild(this.flakeEl);
	this.init();
	snowflakes.push(this);
	snowingEls[el.id].curFlakes++;
}

Snowflake.prototype.init=function()
{
	this.speed=speed+Math.random()*vspeed;
	flake=this.flakeEl;
	flake.setAttribute('class','flake type'+Math.floor((Math.random()*3)+1));
	this.size=minSize+Math.random()*(maxSize-minSize);
	this.x=Math.floor((Math.random()*this.el.clientWidth)+1);
	this.y=-this.size;
	this.hdir=hspeed*(Math.random()-0.5);
	flake.style.fontSize=this.size+'px';
}

Snowflake.prototype.render=function()
{
	s=this.flakeEl.style;
	s.left=this.x+'px';
	s.top=this.y+'px';
}

Snowflake.prototype.dispose=function()
{
	snowingEls[this.el.id].curFlakes--;
	this.flakeEl.parentNode.removeChild(this.flakeEl);
	snowflakes.splice(snowflakes.indexOf(this),1);
}
function renderFlakes()
{
	// render all flakes
	for(i=0;i<snowflakes.length;i++) snowflakes[i].render();
}
function moveFlakes()
{
	// advance each snowflake
	for(i=0;i<snowflakes.length;i++)
	{
		flake=snowflakes[i];
		container=snowingEls[flake.el.id];
		flake.y+=flake.speed;
		if(flake.y>container.lowestFlake)
			container.lowestFlake=flake.y;
		if(flake.y<flake.el.clientHeight)
			flake.x+=flake.hdir;
		else
		if(container.curFlakes>container.nFlakes)
			flake.dispose();
		else
			flake.init();
	}
}
function addFlakes()
{
	// check if we need to create new ones
	for(id in snowingEls)
	{
		entry=snowingEls[id];
		el=document.getElementById(id);
		coveredHeight=entry.lowestFlake/el.clientHeight;
		coveredNum=entry.curFlakes/entry.nFlakes;
		needed=(coveredHeight-coveredNum)*entry.nFlakes;
		for(i=0;i<needed;i++) new Snowflake(el);
	}
}