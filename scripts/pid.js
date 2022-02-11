class PID{
	constructor(p,i,d,mi,mo){
		this.kp=p;
		this.ki=i;
		this.kd=d;
		this.maxInt=mi;
		this.maxOut=mo;
		this.error=0;
		this.lastError=0;
		this.integral=0;
		this.output=0;
	}
	limit(value,min,max){
		return (value<min)?min:(value>max?max:value);
	}
	calc(ref,fdb){
		this.lastError=this.error;
		this.error=ref-fdb;
		var pErr=this.error*this.kp;
		var dErr=(this.error-this.lastError)*this.kd;
		this.integral+=this.ki*this.error;
		this.integral=this.limit(this.integral,-this.maxInt,this.maxInt);
		var sumErr=pErr+dErr+this.integral;
		this.output=this.limit(sumErr,-this.maxOut,this.maxOut);
	}
	clear(){
		this.error=this.lastError=this.integral=this.output=0;
	}
}

class CascadePID{
	constructor(inParams,outParams){
		this.inner=new PID(inParams[0],inParams[1],inParams[2],inParams[3],inParams[4]);
		this.outer=new PID(outParams[0],outParams[1],outParams[2],outParams[3],outParams[4])
		this.output=0;
	}
	calc(outRef,outFdb,inFdb){
		this.outer.calc(outRef,outFdb);
		this.inner.calc(this.outer.output,inFdb);
		this.output=this.inner.output;
	}
	clear(){
		this.inner.clear();
		this.outer.clear();
	}
}
