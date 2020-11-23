<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <br>
                <div>
                    <!-- <span>输入名称查看渔店是否存在：</span> -->
                    <Input  v-model="vieware" style="width: 35%;margin-right:15px" placeholder=" 输入名称查看渔店是否存在"/>
                    <Button  type="primary"  @click="lookover">查看</Button>
                </div>
                <br>
                <Form  :label-width="100" >       
                    <FormItem label="名称:" style="width: 45%;">
                        <Input  v-model="form.fishingStoreName" placeholder=" 输入名称"/>
                    </FormItem>
                    <FormItem label="电话:" style="width: 45%;">
                        <Input v-model="form.phone" placeholder=" 输入电话"/>
                    </FormItem>
                    <FormItem label="省:" style="width: 45%;">
                        <Input v-model="form.province" placeholder=" 输入省份"/>
                    </FormItem>
                    <FormItem label="市:" style="width: 45%;">
                        <Input v-model="form.city" placeholder=" 输入市"/>
                    </FormItem>
                    <FormItem label="区/县:" style="width: 45%; ">
                        <Input  v-model="form.area" placeholder=" 输入区县"/>
                    </FormItem>
                    <FormItem label="详细地址:" style="width: 45%;">
                        <Input v-model="form.address" placeholder=" 输入详细地址"/>
                    </FormItem>
                    <FormItem label="主营渔具:" style="width: 45%;">
                        <Input v-model="form.mainFishingGear" placeholder=" 输入主营渔具"/>
                    </FormItem>
                    <FormItem label="简介:" style="width: 45%;">
                        <Input v-model="form.introduction"  placeholder=" 输入简介"/>
                    </FormItem>
                    <FormItem label="图片:" style="width: 45%;">
                        <upload-pic-input v-model="form.image" style="width:100%"></upload-pic-input>
                    </FormItem>
                    <FormItem label="封面图:" style="width: 45%;">
                        <upload-pic-input v-model="form.coverPicture" style="width:100%"></upload-pic-input>
                    </FormItem>
                    <FormItem label="经度:" style="width: 45%;">
                            <Input v-model="form.longitude" placeholder="请双击地图来获得经纬度" disabled/>
                        </FormItem>
                        <FormItem label="纬度:" style="width: 45%;">
                            <Input v-model="form.latitude" placeholder="请双击地图来获得经纬度" disabled/>
                        </FormItem>
                     <!-- 百度地图 -->
                    <Input v-model="addressKeyword" placeholder="请输入地址来直接查找相关位置"  style="width: 94%;"/>
                    <baidu-map
                        class="bmView"
                        :scroll-wheel-zoom="true"
                        :center="location"
                        :zoom="zoom"
                        @click="getLocationPoint"
                        ak="YOUR_APP_KEY"
                    >
                        <bm-view style="width: 94%; height:400px; flex: 1"></bm-view>
                        <bm-local-search :keyword="addressKeyword" :auto-viewport="true" style="display: none"></bm-local-search>
                    </baidu-map><br>
                    <div style="margin-left: 30px">
                        <Button type="primary"  @click="addfish">确定添加</Button>
                    </div>
                </Form>
            </Card>
        </Col>
    </Row>

</div>
</template>

<script>
import uploadPicInput from "@/views/my-components/xboot/upload-pic-input";
export default {
    components: {
        uploadPicInput
    },
data() {
    return {
        location: {
            lng: 116.404,
            lat: 39.915
        },
        zoom: 12.8,
        addressKeyword: "",

        vieware:'',
        form: {
            fishingStoreName:'',  //名称
            phone:'',   //电话
            province:'',  //省
            city:'',  //市
            area:'',  //区/县
            address:'',  //详细地址
            mainFishingGear:'',  //主营渔具
            introduction:'',  //简介
            image:'',   //图片
            coverPicture:'',  //封面图
            longitude: "",  //经度
            latitude: "",  //维度
        },
    };
},
    methods: {
        getLocationPoint(e) {
            this.lng = e.point.lng;
            this.lat = e.point.lat;
            this.form.longitude=e.point.lng
            this.form.latitude=e.point.lat
             console.log(e.point.lng)
                console.log(e.point.lat)
            /* 创建地址解析器的实例 */
            let geoCoder = new BMap.Geocoder();
            /* 获取位置对应的坐标 */
            geoCoder.getPoint(this.addressKeyword, point => {
                this.selectedLng = point.lng;
                this.selectedLat = point.lat;
                console.log(this.addressKeyword)
            });
            /* 利用坐标获取地址的详细信息 */
            geocoder.getLocation(e.point,res=>{
                console.log(res)
            })
        },
        lookover(){
            if(this.vieware==''){
                this.$Message.warning("不能为空");
            }else{
                this.postRequest('/fishingStore/getByFishingStoreName',{fishingStoreName:this.vieware}).then(res=>{
                    if(res.success){
                        this.$Message.success("这个名称不存在");
                    }
                })
            }
        },
        addfish () {
             if(!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.form.phone))){ 
                this.$Message.warning("手机号码格式不正确");
                console.log('sdfsdfsdfsdf')
                return false; 
            }else if(this.form.fishingStoreName=='' || this.form.address==''){
                this.$Message.warning("名称、详细地址、不能为空");
            }else{
                 this.postRequest("/fishingStore/saveFishingStore",this.form).then(res => {
                    if (res.success) {
                        this.$Message.success("操作成功");
                    }
                    console.log(res)
                });
            }
           
        },
    },
};
</script>
<style lang="less">
.search {
    .operation {
        margin-bottom: 2vh;
    }
    .select-count {
        font-size: 13px;
        font-weight: 600;
        color: #40a9ff;
    }
    .select-clear {
        margin-left: 10px;
    }
    .page {
        margin-top: 2vh;
    }
    .drop-down {
        font-size: 13px;
        margin-left: 5px;
    }
    .createuser{
        width: 220px;
        height: 33px;
        border-radius: 3px;
        border: 1px solid #dcdee2;
        margin-right: 43px;
    }
    .fonts{
        font-size: 13px
    }
    .photo{
        width: 100px;
        height: 100px;
        border-radius: 100px;
        
    }
}
</style>