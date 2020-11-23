<template>
<div class="search">
    <Row>
        <Col>
            <Card>
                <div>
                    <Button @click="addadvertising" icon="plus" type="primary" style="margin-left: 10px">添加全国赛事</Button>
                </div>
                <br>
                <div>
                    <span style="margin-left: 15px">比赛名称：</span>
                    <Input v-model="searchForm.gameName" placeholder="输入名称" style="width:15%;"/>
                    <Button @click="seekwe" type="primary" icon="ios-search" style="margin-left: 10px">搜索</Button>   
                </div>
                <br>
                <Row class="operation">
                    <Button @click=" searcher" icon="md-refresh">刷新</Button>
                </Row>
                <Row>
                    <Table :loading="loading" border :columns="columns" :data="data" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                </Row>
                <Row type="flex" justify="end" class="page">
                    <Page :current="searchForm.pageNumber" :total="total" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                </Row>

                <Modal title="添加全国赛事" v-model="modalVisible" :mask-closable='false' :width="600">
                    <Form  :label-width="130" >       
                        <FormItem label="比赛名称:">
                            <Input :disabled="gameStatus==1||gameStatus==2"  v-model="advertising.gameName"/>
                        </FormItem>
                        <FormItem label="比赛封面图:">
                            <upload-pic-input :disabled="gameStatus==1||gameStatus==2"  v-model="advertising.imgUrl" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="报名开始-结束时间:">
                            <Date-picker 
                            type="datetime" 
                            placeholder="选择报名开始时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            v-model="advertising.signStartDateStr"
                            @on-change="applystatetime"
                            :disabled="gameStatus==1||gameStatus==2" 
                            style="width: 200px">
                            </Date-picker>
                            至
                            <Date-picker 
                            type="datetime" 
                            placeholder="选择报名结束时间" 
                            format="yyyy-MM-dd HH:mm:ss"
                            :disabled="gameStatus==1||gameStatus==2" 
                            @on-change="applyendtime" 
                            v-model="advertising.signEndDateStr"
                            style="width: 200px">
                            </Date-picker>
                        </FormItem>
                        
                        <FormItem label="比赛开始-结束时间:">
                            <Date-picker 
                            type="datetime" 
                            :disabled="gameStatus==1||gameStatus==2" 
                            placeholder="选择比赛开始时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            v-model="advertising.gameStartDateStr"
                            @on-change="gamestatetime" 
                            style="width: 200px">
                            </Date-picker>
                            至
                            <Date-picker 
                            type="datetime" 
                            :disabled="gameStatus==1||gameStatus==2" 
                            placeholder="选择比赛结束时间"
                            format="yyyy-MM-dd HH:mm:ss"
                            v-model="advertising.gameEndDateStr"
                            @on-change="gamesendtime" 
                            style="width: 200px">
                            </Date-picker>
                        </FormItem>
                        <FormItem  label="第一名奖金分配比例:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="比如0.4" v-model="first"/>
                        </FormItem>
                        <FormItem label="第二名奖金分配比例:">
                            <Input :disabled="gameStatus==1||gameStatus==2"  placeholder="比如0.3" v-model="two"/>
                        </FormItem>
                        <FormItem label="第三名奖金分配比例:">
                            <Input :disabled="gameStatus==1||gameStatus==2"   placeholder="比如0.2" v-model="thirdly"/>
                        </FormItem>
                        <FormItem label="奖金:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入奖金" v-model="advertising.bonus"/>
                        </FormItem>
                        <FormItem label="报名费用:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入报名费用" v-model="advertising.signFee"/>
                        </FormItem>
                        <FormItem label="联系电话:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入联系电话" type="number" v-model="advertising.phoneNum"/>
                        </FormItem>
                        <FormItem label="比赛章程:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入比赛章程"  v-model="advertising.constitution"/>
                        </FormItem>
                        <FormItem label="比赛规则:">
                            <mavon-editor v-model="advertising.rules"/>
                        </FormItem>
                        <FormItem label="主办方:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入主办方" v-model="advertising.organizers"/>
                        </FormItem>
                        <FormItem label="协办方:">
                            <Input :disabled="gameStatus==1||gameStatus==2" placeholder="选择输入协办方" v-model="advertising.assistOrganizer"/>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button :disabled="gameStatus==1||gameStatus==2"  type="primary"  @click="handleSubmit(advertising)">确定</Button>
                    </div>
                </Modal>

                <Modal title="赛点列表" v-model="addmatchmodal" :mask-closable='false' :width="1300">
                    <div>
                        <Button :disabled="gameStatus==2" @click="addspot" icon="plus" type="primary" style="margin-left: 10px">{{gameStatus==0?'添加赛点':(gameStatus==1?'全国赛已开始':'全国赛已结束')}}</Button>
                    </div>
                    <br>
                    <Row class="operation">
                        <Button @click="levelDataList" icon="md-refresh">刷新</Button>
                    </Row>
                    <br>
                    <Row>
                        <Table :loading="loading" border :columns="columns1" :data="data1" ref="table" sortable="custom" @on-selection-change="changeSelect"></Table>
                    </Row>
                    <Row type="flex" justify="end" class="page">
                        <Page :current="searchForm.pageNumber" :total="total1" :page-size="searchForm.pageSize" @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]" size="small" show-total show-elevator show-sizer></Page>
                    </Row>
                    <div slot="footer">
                        <Button type="primary"  @click="addmatchmodal=false">确定</Button>
                    </div>
                </Modal>

                <!-- 二级页面添加赛点弹窗 -->
                <Modal title="添加全国赛点" v-model="addallSpot" :mask-closable='false' :width="600">
                    <Form  :label-width="130" >       
                        <FormItem label="比赛名称:">
                            <Input v-model="second.gameName"/>
                        </FormItem>
                        <FormItem label="比赛封面图:">
                            <upload-pic-input v-model="second.imgUrl" style="width:100%"></upload-pic-input>
                        </FormItem>
                        <FormItem label="比赛地点(鱼塘id):">
                            <Input v-model="second.gameSite"/>
                        </FormItem>
                        <FormItem label="比赛开始-结束时间:">
                            <Date-picker 
                            type="datetime" 
                            placeholder="选择比赛开始时间" 
                            v-model="second.gameStartDateStr"
                            @on-change="Spotgamestatetime" 
                            style="width: 200px">
                            </Date-picker>
                            至
                            <Date-picker 
                            type="datetime" 
                            placeholder="选择比赛结束时间"
                            v-model="second.gameEndDateStr"
                            @on-change="Spotgamesendtime" 
                            style="width: 200px">
                            </Date-picker>
                        </FormItem>
                        <FormItem label="联系方式:">
                            <Input type="number" v-model="second.phoneNum"/>
                        </FormItem>
                        <FormItem label="限制人数量:">
                            <Input v-model="second.number"/>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="spotSubmit">确定</Button>
                    </div>
                </Modal>

                <Modal title="赛点详情" v-model="leveldetalsModel" :mask-closable='false' :width="600">
                    <Form  :label-width="130" >       
                        <FormItem label="比赛名称:">
                            <Input disabled v-model="second.gameName"/>
                        </FormItem>
                        <FormItem label="比赛封面图:">
                            <img :src="second.imgUrl" alt="" style="width: 100px;height: 100px;">
                        </FormItem>
                        <FormItem label="比赛地点(鱼塘id):">
                            <Input disabled v-model="second.gameSite"/>
                        </FormItem>
                        <FormItem label="比赛开始时间:">
                            <Input disabled v-model="second.gameStartDateStr"/>
                        </FormItem>
                        <FormItem label="比赛结束时间:">
                            <Input disabled v-model="second.gameEndDateStr"/>
                        </FormItem>
                        <FormItem label="联系方式:">
                            <Input  disabled v-model="second.phoneNum"/>
                        </FormItem>
                        <FormItem label="全国赛事的ID:">
                            <Input disabled v-model="second.fishingGameFirstId"/>
                        </FormItem>
                         <FormItem label="限制人数:">
                            <Input disabled v-model="second.number"/>
                        </FormItem>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="leveldetalsModel=false">确定</Button>
                    </div>
                </Modal>
                <Modal title="报名信息" v-model="applyModal" :mask-closable='false' :width="400">
                    <Form  :label-width="130" >       
                        <div v-for="item in applydata" :key="item.index" style="display: flex;">
                            <div style="line-height: 55px;width:30px"><span style="font-size:22px">{{item.rownum}}</span></div>
                            <img :src="item.avatar" alt="" style="width: 50px;height: 50px;margin: 0 10px 0 10px;">
                            <div style="line-height: 57px;margin: 0 30px 0 0px;width:70px">{{item.nick_name}}</div>
                            <div style="line-height: 57px;" v-if="item.level==1">渔界小白</div>
                            <div style="line-height: 57px;" v-if="item.level==2">渔界萌新</div>
                            <div style="line-height: 57px;" v-if="item.level==3">渔界猎手</div>
                            <div style="line-height: 57px;" v-if="item.level==4">渔界高手</div>
                            <div style="line-height: 57px;" v-if="item.level==5">渔界大师</div>
                            <div style="line-height: 57px;" v-if="item.level==6">渔界元老</div>
                            <div style="line-height: 57px;" v-if="item.level==7">渔界佳话</div>
                            <div style="line-height: 57px;" v-if="item.level==8">渔界传说</div>
                            <div style="line-height: 57px;" v-if="item.level==9">渔界神话</div>
                            <div style="line-height: 57px;" v-if="item.level==10">渔界霸主</div>
                            <div style="line-height: 57px;" v-if="item.level==11">渔界独尊</div>
                            <div style="line-height: 57px;margin: 0 0px 0 30px;" >{{item.fish_world_racing}}</div>
                            <div>{{item.is_arrivals}}</div>
                        </div>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="applyModal=false">确定</Button>
                    </div>
                </Modal>
                <Modal title="名次信息" v-model="rankingModal" :mask-closable='false' :width="450">
                    <Form  :label-width="130" >       
                        <div v-for="item in rankingdata" :key="item.index" style="display: flex;">
                            <div style="line-height: 57px;width:40px"><span style="font-size:22px">{{item.rownum}}</span>名</div>
                            <img :src="item.avatar" alt="" style="width: 50px;height: 50px;margin: 0 10px 0 10px;">
                            <div style="line-height: 57px;margin: 0 30px 0 0px;width:70px">{{item.nick_name}}</div>
                            <div style="line-height: 57px;" v-if="item.level==1">渔界小白</div>
                            <div style="line-height: 57px;" v-if="item.level==2">渔界萌新</div>
                            <div style="line-height: 57px;" v-if="item.level==3">渔界猎手</div>
                            <div style="line-height: 57px;" v-if="item.level==4">渔界高手</div>
                            <div style="line-height: 57px;" v-if="item.level==5">渔界大师</div>
                            <div style="line-height: 57px;" v-if="item.level==6">渔界元老</div>
                            <div style="line-height: 57px;" v-if="item.level==7">渔界佳话</div>
                            <div style="line-height: 57px;" v-if="item.level==8">渔界传说</div>
                            <div style="line-height: 57px;" v-if="item.level==9">渔界神话</div>
                            <div style="line-height: 57px;" v-if="item.level==10">渔界霸主</div>
                            <div style="line-height: 57px;" v-if="item.level==11">渔界独尊</div>
                            <div style="line-height: 57px;margin: 0 0px 0 30px;" >{{item.fish_world_racing}}</div>
                            <div style="line-height: 57px;margin: 0 0px 0 30px;" >{{item.score}}</div>
                        </div>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="rankingModal=false">确定</Button>
                    </div>
                </Modal>
                <Modal title="全国名次信息" v-model="worldModal" :mask-closable='false' :width="450">
                    <Form  :label-width="130" >       
                        <div v-for="item in worlddata" :key="item.index" style="display: flex;">
                            <div style="line-height: 57px;width:40px"><span style="font-size:22px">{{item.rownum}}</span>名</div>
                            <img :src="item.avatar" alt="" style="width: 50px;height: 50px;margin: 0 10px 0 10px;">
                            <div style="line-height: 57px;margin: 0 30px 0 0px;width:60px">{{item.nick_name}}</div>
                            <div style="line-height: 57px;" v-if="item.level==1">渔界小白</div>
                            <div style="line-height: 57px;" v-if="item.level==2">渔界萌新</div>
                            <div style="line-height: 57px;" v-if="item.level==3">渔界猎手</div>
                            <div style="line-height: 57px;" v-if="item.level==4">渔界高手</div>
                            <div style="line-height: 57px;" v-if="item.level==5">渔界大师</div>
                            <div style="line-height: 57px;" v-if="item.level==6">渔界元老</div>
                            <div style="line-height: 57px;" v-if="item.level==7">渔界佳话</div>
                            <div style="line-height: 57px;" v-if="item.level==8">渔界传说</div>
                            <div style="line-height: 57px;" v-if="item.level==9">渔界神话</div>
                            <div style="line-height: 57px;" v-if="item.level==10">渔界霸主</div>
                            <div style="line-height: 57px;" v-if="item.level==11">渔界独尊</div>
                            <div style="line-height: 57px;margin: 0 0px 0 30px;" >{{item.fish_world_racing}}</div>
                            <div style="line-height: 57px;margin: 0 0px 0 30px;" >{{item.score}}</div>
                        </div>
                    </Form>
                    <div slot="footer">
                        <Button type="primary"  @click="worldModal=false">确定</Button>
                    </div>
                </Modal>
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
        value:'',
        loading: true, // 表单加载状态
        addmatchmodal:false,
        addallSpot:false,//二级页面的添加赛点按钮
        gameStatus:'',//判断赛点是否可以添加
        leveldetalsModel:false,
        leveleditModel:false,
        applyModal:false,
        worldModal:false,
        selectDate:[],
        rankingdata:[],
        applydata:[],
        worlddata:[],
        chartType:'',
        modalVisible:false,
        commodityTypeId:'',
        ivibe:'',
        first:'',
        rankingModal:false,
        two:'',
        thirdly:'',
        advertising:{
            gameName:"",
            imgUrl:"",
            signStartDateStr:"",
            signEndDateStr:"",
            gameStartDateStr:"",
            gameEndDateStr:"",
            distributionJson:[],
            bonus:"",
            signFee:"",
            constitution:"",
            rules:"",
            id:'',
            phoneNum:'',
            advertising:'',
            organizers:''
        },
        second:{
            gameName:"",
            gameSite:"",
            imgUrl:"",
            signStartDateStr:"",
            signEndDateStr:"",
            gameStartDateStr:"",
            gameEndDateStr:"",
            phoneNum:"",
            fishingGameFirstId:"",
            number:"",
        },
        searchForm: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            type:'0',
        },
        searchfan: { // 搜索框初始化对象
            pageNumber: 1,//页号
            pageSize: 10,
            type:'0',
        },
        levelForm:{
            pageNumber: 1,//页号
            pageSize: 10,
            fishingGameFirstId:'',
        },
        type:'',
        prohibit:'',
        selectList: [], // 多选数据
        selectCount: 0, // 多选计数
        columns1:[
            // 表头
            {
            type: "selection",
            width: 50,
            align: "center"
            },
            {
            type: "index",
            width: 60,
            align: "center"
            },
            {
                title:'比赛名称',
                key: 'gameName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'赛点编号(id)',
                key: 'id',
                minWidth:90,
                sortable:false,
            },
            {
                title: "封面图",
                key: "imgUrl",
                minWidth: 120,
                sortable: false,
                 render: (h, params) => {
                    if (params.row.imgUrl != null && params.row.imgUrl != '' && params.row.imgUrl != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.imgUrl == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.imgUrl,
                            style: "width: 60px;height: 60px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.imgUrl;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title:'比赛地点(鱼塘ID)',
                key: 'gameSite',
                minWidth:90,
                sortable:false,
            },
            {
                title:'联系方式',
                key: 'phoneNum',
                minWidth:90,
                sortable:false,
            },
            {
                title:'限制人数',
                key: 'number',
                minWidth:70,
                sortable:false,
            },
            {
            title: "操作",
            key: "action",
            align: "center",
            width: 360,
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                            type: "primary",
                            size: "small",
                            icon: "ios-create-outline"
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.leveldetails(params.row);
                            }
                            }
                        },
                        "详情"
                    ),
                    h(
                        "Button",
                        {
                            props: {
                                type: "error",
                                size: "small",
                                icon: "md-trash"
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                this.leveledit(params.row);
                                }
                            }
                        },
                        "删除"
                    ),
                    h(
                        "Button",
                        {
                            props: {
                            type: "primary",
                            size: "small",
                            icon: "ios-create-outline"
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.applymessage(params.row);
                            }
                            }
                        },
                        "报名信息"
                    ),
                    h(
                        "Button",
                        {
                            props: {
                            type: "primary",
                            size: "small",
                            icon: "ios-create-outline"
                            },
                            style: {
                            marginRight: "5px"
                            },
                            on: {
                            click: () => {
                                this.rankingmessage(params.row);
                            }
                            }
                        },
                        "名次信息"
                    ),
                ]);
            }
            }
        ],
        columns: [
            // 表头
            {
            type: "selection",
            width: 50,
            align: "center"
            },
            {
            type: "index",
            width: 60,
            align: "center"
            },
            {
                title:'比赛名称',
                key: 'gameName',
                minWidth:90,
                sortable:false,
            },
            {
                title:'比赛编号(id)',
                key: 'id',
                minWidth:120,
                sortable:false,
            },
            {
                title: "封面图",
                key: "imgUrl",
                minWidth: 120,
                sortable: false,
                 render: (h, params) => {
                    if (params.row.imgUrl != null && params.row.imgUrl != '' && params.row.imgUrl != undefined) {
                    return h(
                        "div",
                        [
                        h("img", {
                            props: {
                            type: "primary",
                            size: "small",
                            display: params.row.imgUrl == "" ? "none" : "inline-block"
                            },
                            attrs: {
                            src: params.row.imgUrl,
                            style: "width: 100px;height: 100px;"
                            },
                            style: {},
                            on: {
                            click: () => {
                                this.viewImage = true;
                                this.currentValue = params.row.imgUrl;
                            }
                            }
                        })
                        ]
                    );
                    }
                }
            },
            {
                title:'奖金',
                key: 'bonus',
                minWidth:80,
                sortable:false,
            },
            {
                title:'报名费用',
                key: 'signFee',
                minWidth:80,
                sortable:false,
            },
            {
                title:'比赛章程',
                key: 'constitution',
                minWidth:90,
                sortable:false,
            },
            {
                title:'比赛规则',
                key: 'rules',
                minWidth:90,
                sortable:false,
            },
            {
                title:'比赛状态',
                key: 'status',
                minWidth:90,
                sortable:false,
                render:(h, params) =>{
                    if(params.row.status == '0'){
                        return h("span","比赛未开始")
                    }else if(params.row.status == '1'){
                        return h("span", '比赛已开始')
                    }else if(params.row.status == '2'){
                        return h("span", '比赛已结束')
                    }
                }
            },
            {
            title: "操作",
            key: "action",
            align: "center",
            width: 450,
            render: (h, params) => {
                return h("div", [
                    h(
                        "Button",
                        {
                            props: {
                                type: "primary",
                                size: "small",
                                icon: "ios-create-outline",
                                // disabled:(params.row.status == 1||params.row.status == 2)
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.getOrderInfo(params.row);
                                }
                            }
                        },
                        '编辑全国赛事'
                        // params.row.status==0? "编辑全国赛事" :(params.row.status==1?'已开始不可编辑':'已结束不可编辑')
                    ),
                    h(
                        "Button",
                        {
                            props: {
                                type: "primary",
                                size: "small",
                                icon: "ios-create-outline",
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.addmatch(params.row);
                                }
                            }
                        },
                        "编辑查看赛点"
                    ), 
                    h(
                        "Button",
                        {
                            props: {
                                type: "primary",
                                size: "small",
                                icon: "ios-create-outline",
                                disabled:(params.row.status == 0||params.row.status == 1)
                            },
                            style: {
                                marginRight: "5px"
                            },
                            on: {
                                click: () => {
                                    this.worldranking(params.row);
                                }
                            }
                        },
                        params.row.status==2? "全国赛事名次" :(params.row.status==1?'比赛已进行中无法查看名次':'比赛未开始无法查看名次')
                    ), 
                ]);
            }
            }
        ],
        data: [], // 表单数据
        total: 0, // 表单数据总数
        data1: [], // 表单数据
        total1:0
    };
},
methods: {
    init() {
        this.getDataList();
    },
    seekwe(){
        this.searchForm.pageNumber=1
        this.getDataList();
    },
     uploadFile (file) {
         console.log(file)
        this.postRequest('/alioss/upload?file='+file).then(res=>{
            this.advertising.image=res
            console.log(res)
        })
    },
    changePage(v) {//点击吧页号赋值给pageNumber
      console.log(v)
        this.searchForm.pageNumber = v;
        this.getDataList();
        this.clearSelectAll();
    },
    changePageSize(v) {
        console.log(v)
        this.searchForm.pageSize = v;
        this.getDataList();
    },
    clearSelectAll() {
        this.$refs.table.selectAll(false);
    },
    changeSelect(e) {
        this.selectList = e;
        this.selectCount = e.length;
    },
    spotSubmit(){//二级页面添加赛点弹窗里的确定按钮
        this.postRequest('/fishingGameMp/saveFishingGameNationwideMatchPoint',this.second).then(res=>{
            if(res.success){
                this.addallSpot=false
                this.$Message.success("添加成功");
                this.levelDataList()
            }
        })
    },
    worldranking(v){//全国赛事名次
        this.worldModal=true
        this.postRequest("/fishingGame/queryNationwideFishingGameScore",{gameId:v.id}).then(res => {
            if (res.success) {
               this.worlddata = res.result
            }
            console.log(res,'名次信息')
        });
    },
    applymessage(v){//报名信息
        this.applyModal=true
        this.postRequest("/fishingGame/queryFishingGameScore",{gameId:v.id,type:1}).then(res => {
            if (res.success) {
               this.applydata = res.result
            }
            console.log(res,'名次信息')
        });
    },
    rankingmessage(v){//名次信息
        this.rankingModal=true
        this.postRequest("/fishingGame/queryFishingGameScore",{gameId:v.id}).then(res => {
            if (res.success) {
               this.rankingdata = res.result
            }
            console.log(res,'名次信息')
        });
    },
    leveledit(v){
        console.log(v)
        this.$Modal.confirm({
            title: "确认删除",
            content: "您确认要删除?",
            loading: true,
            onOk: () => {
            // 删除
            this.postRequest("/fishingGameMp/delFishingGameByIds?fishingGameId=" + v.id).then(res => {
                this.$Modal.remove();
                if (res.success) {
                this.$Message.success("删除成功");
                this.getDataList();
                this.levelDataList()
                }
                console.log(res)
            });
            }
        });
    },
    levelDataList(){//二级页面数据列表
        this.loading = true;
        this.postRequest("/fishingGameMp/getPcFishingGameMatchPoint",this.levelForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total1 = res.result.total;
                var dataList = res.result.records
                this.data1=dataList
            }
            console.log(res)
        });
    },
    leveldetails(v){//二级页面的详情按钮
        this.leveldetalsModel=true
        this.second.gameName=v.gameName,
        this.second.gameSite=v.gameSite,
        this.second.imgUrl=v.imgUrl,
        this.second.signStartDateStr=v.signStartDate,
        this.second.signEndDateStr=v.signEndDate,
        this.second.gameStartDateStr=v.gameStartDate,
        this.second.gameEndDateStr=v.gameEndDate,
        this.second.phoneNum=v.phoneNum,
        this.second.fishingGameFirstId=v.fishingGameFirstId,
        this.second.number=v.number
        console.log(v)
    },
    addspot(){//二级页面添加赛点
        this.addallSpot=true
        this.second.gameName=''
        this.second.gameSite=''
        this.second.imgUrl=''
        this.second.signStartDateStr=''
        this.second.signEndDateStr=''
        this.second.gameStartDateStr=''
        this.second.gameEndDateStr=''
        this.second.phoneNum=''
        this.second.number=''

    },
    Spotapplystatetime(v){//二级页面比赛开始时间
        this.second.signStartDateStr=v
    },
    Spotapplyendtime(v){//二级页面比赛结束时间
        this.second.signEndDateStr=v
    },
    Spotgamestatetime(v){//二级页面报名开始时间
        this.second.gameStartDateStr=v
    },
    Spotgamesendtime(v){//二级页面报名结束时间
        this.second.gameEndDateStr=v
    },
    gamestatetime(v){//比赛开始时间
        console.log(v,this.advertising.gameStartDateStr)
        this.advertising.gameStartDateStr=v
    },
    gamesendtime(v){//比赛结束时间
        console.log(v,this.advertising.gameEndDateStr)
        this.advertising.gameEndDateStr=v
    },
    applystatetime(v){//报名结束时间
        this.advertising.signStartDateStr=v
        console.log(v,this.advertising.signStartDateStr)
    },
    applyendtime(v){//报名开始时间
        this.advertising.signEndDateStr=v
        console.log(v,this.advertising.signEndDateStr)
    },
    addadvertising(){//添加全国赛事按钮
        this.advertising={}
        this.advertising.id=''
        this.modalVisible=true
        this.first=''
        this.two=''
        this.thirdly=''
        this.gameStatus=''
    },
    getOrderInfo(v){//编辑全国赛事
        console.log(v)
        this.modalVisible=true
        this.advertising.gameName=v.gameName
        this.advertising.imgUrl=v.imgUrl
        this.advertising.bonus=v.bonus
        this.advertising.signFee=v.signFee
        this.advertising.constitution=v.constitution
        this.advertising.rules=v.rules
        // var signStartStr = this.formatTime(v.signStartDate)
        this.advertising.signStartDateStr = v.signStartDate
        this.advertising.signEndDateStr = v.signEndDate
        this.advertising.gameStartDateStr=v.gameStartDate
        this.advertising.gameEndDateStr=v.gameEndDate
        this.advertising.id=v.id
        this.gameStatus=v.status
        this.advertising.phoneNum=v.phoneNum
        this.advertising.organizers=v.organizers
        this.advertising.assistOrganizer=v.assistOrganizer
        let arss=JSON.parse(v.distributionJson)
        this.first=arss[0]
        this.two=arss[1]
        this.thirdly=arss[2]
        console.log(this.advertising)
    },
    addmatch(v){//一级页面的添加赛点
        this.addmatchmodal=true
        this.second.fishingGameFirstId=v.id
        this.levelForm.fishingGameFirstId=v.id
        this.levelDataList()
        this.gameStatus=v.status
        console.log(v)
    },
    searcher(){//一级页面的刷新
        this.searchForm.gameName=''
        this.searchForm.type=''
        this.loading = true;
        this.postRequest("/fishingGameMp/getFishingGamePcPage",this.searchfan).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    getDataList () {//一级页面数据列表
        this.loading = true;
        this.postRequest("/fishingGameMp/getFishingGamePcPage",this.searchForm).then(res => {
            this.loading = false;
            if (res.success) {
                this.total = res.result.total;
                var dataList = res.result.records
                this.data=dataList
            }
            console.log(res)
        });
    },
    handleSubmit(v){//一级页面的添加全国赛事
        console.log(v)
        let fendata=(this.first+','+this.two+','+this.thirdly).split(',')
        this.advertising.distributionJson=JSON.stringify(fendata)
        if(this.advertising.organizers==''||this.advertising.organizers==null||this.advertising.organizers==undefined){
            this.$Message.warning("请输入主办方");
        }else{
            if(this.advertising.id==''){
                this.postRequest('/fishingGameMp/saveFishingGameNationwide',this.advertising).then(res=>{
                    if(res.success){
                        this.modalVisible=false
                        this.$Message.success("添加成功");
                        this.getDataList()
                    }
                })
            }else{
                console.log(this.advertising,'ssdddeewwwefffggererewedffgfg')
                console.log(v,'编辑')
                if(JSON.stringify(this.advertising.signStartDateStr).length > 21){
                    this.advertising.signStartDateStr=this.dateFormat("YYYY-mm-dd HH:MM:SS", this.advertising.signStartDateStr)
                }
                if(JSON.stringify(this.advertising.signEndDateStr).length > 21){
                    this.advertising.signEndDateStr=this.dateFormat("YYYY-mm-dd HH:MM:SS", this.advertising.signEndDateStr)
                }
                if(JSON.stringify(this.advertising.gameStartDateStr).length > 21){
                    this.advertising.gameStartDateStr=this.dateFormat("YYYY-mm-dd HH:MM:SS", this.advertising.gameStartDateStr)
                }
                if(JSON.stringify(this.advertising.gameEndDateStr).length > 21){
                    this.advertising.gameEndDateStr=this.dateFormat("YYYY-mm-dd HH:MM:SS", this.advertising.gameEndDateStr)
                }
                this.postRequest('/fishingGameMp/updateFishingGameNationwide',this.advertising).then(res=>{
                    if(res.success){
                        this.modalVisible=false
                        this.$Message.success("编辑成功");
                        this.getDataList()
                    }
                })
            }
        }
    },
    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    },
    stateDateRange(v){
        this.addfome.startTime=v
    },
    endDateRange(v){
        this.addfome.endTime=v
    }
},
mounted() {
        this.init();
    }
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