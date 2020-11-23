 const fishdata = {
    setPushLive() {
        this.postRequest("/fingerlingInfo/getAll").then(res => {
            if (res.success) {
            }
             console.log(res,'rweqewrrt')
        });
    },
    addatalist(){
        console.log('我是我是adfadfasf是否')
    }
}
module.exports = {
	setPushLive: fishdata.setPushLive,
	addatalist: fishdata.addatalist,
}