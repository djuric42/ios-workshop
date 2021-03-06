/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/core/Control','sap/ui/core/LocaleData','sap/ui/unified/calendar/CalendarUtils','./calendar/Header','./calendar/TimesRow','./calendar/DatesRow','./calendar/MonthPicker','./calendar/YearPicker','sap/ui/core/date/UniversalDate','./library','sap/ui/core/format/DateFormat','sap/ui/Device','sap/ui/core/Locale','sap/ui/core/library',"./CalendarTimeIntervalRenderer","sap/ui/dom/containsOrEquals","sap/base/util/deepEqual","sap/ui/core/Popup","sap/base/Log","sap/ui/thirdparty/jquery","sap/ui/unified/DateRange","sap/ui/unified/Calendar"],function(C,L,a,H,T,D,M,Y,U,l,b,c,d,e,f,g,h,P,i,q,j,k){"use strict";var m=C.extend("sap.ui.unified.CalendarTimeInterval",{metadata:{library:"sap.ui.unified",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null},startDate:{type:"object",group:"Data"},intervalSelection:{type:"boolean",group:"Behavior",defaultValue:false},singleSelection:{type:"boolean",group:"Behavior",defaultValue:true},items:{type:"int",group:"Appearance",defaultValue:12},intervalMinutes:{type:"int",group:"Appearance",defaultValue:60},pickerPopup:{type:"boolean",group:"Appearance",defaultValue:false},minDate:{type:"object",group:"Misc",defaultValue:null},maxDate:{type:"object",group:"Misc",defaultValue:null}},aggregations:{selectedDates:{type:"sap.ui.unified.DateRange",multiple:true,singularName:"selectedDate"},specialDates:{type:"sap.ui.unified.DateTypeRange",multiple:true,singularName:"specialDate"},header:{type:"sap.ui.unified.calendar.Header",multiple:false,visibility:"hidden"},timesRow:{type:"sap.ui.unified.calendar.TimesRow",multiple:false,visibility:"hidden"},datesRow:{type:"sap.ui.unified.calendar.Month",multiple:false,visibility:"hidden"},monthPicker:{type:"sap.ui.unified.calendar.MonthPicker",multiple:false,visibility:"hidden"},yearPicker:{type:"sap.ui.unified.calendar.YearPicker",multiple:false,visibility:"hidden"},calendarPicker:{type:"sap.ui.unified.Calendar",multiple:false,visibility:"hidden"}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},legend:{type:"sap.ui.unified.CalendarLegend",multiple:false}},events:{select:{},cancel:{},startDateChange:{}}}});m.prototype.init=function(){this._iMode=0;this._oYearFormat=b.getDateInstance({format:"y"});this.data("sap-ui-fastnavgroup","true",true);this._oMinDate=new U(new Date(Date.UTC(1,0,1)));this._oMinDate.getJSDate().setUTCFullYear(1);this._oMaxDate=new U(new Date(Date.UTC(9999,11,31,23,59,59)));this._initializeHeader();this._initializeTimesRow();this._initilizeMonthPicker();this._initilizeYearPicker();this.setPickerPopup(false);this._iItemsHead=15;};m.prototype._initializeHeader=function(){var e1=new H(this.getId()+"--Head");e1.attachEvent("pressPrevious",this._handlePrevious,this);e1.attachEvent("pressNext",this._handleNext,this);this.setAggregation("header",e1);};m.prototype._initializeTimesRow=function(){var e1=new T(this.getId()+"--TimesRow");e1.attachEvent("focus",N,this);e1.attachEvent("select",K,this);e1._bNoThemeChange=true;this.setAggregation("timesRow",e1);};m.prototype._initilizeMonthPicker=function(){this.setAggregation("monthPicker",this._createMonthPicker());};m.prototype._initilizeYearPicker=function(){this.setAggregation("yearPicker",this._createYearPicker());};m.prototype._createDatesRow=function(){var e1=new D(this.getId()+"--DatesRow",{days:18,selectedDates:[new j(this.getId()+"--Range")]});e1.attachEvent("focus",R,this);e1.attachEvent("select",Q,this);e1._bNoThemeChange=true;e1.getIntervalSelection=function(){return this.getProperty("intervalSelection");};e1.getSingleSelection=function(){return this.getProperty("singleSelection");};e1.getSelectedDates=function(){return this.getAggregation("selectedDates",[]);};e1.getSpecialDates=function(){return this.getAggregation("specialDates",[]);};e1.getAriaLabelledBy=function(){return this.getAssociation("ariaLabelledBy",[]);};return e1;};m.prototype._createMonthPicker=function(){var e1=new M(this.getId()+"--MP",{columns:0,months:6});e1.attachEvent("select",S,this);e1._bNoThemeChange=true;e1.attachEvent("pageChange",c1,this);return e1;};m.prototype._createYearPicker=function(){var e1=new Y(this.getId()+"--YP",{columns:0,years:6});e1.attachEvent("select",V,this);e1.attachEvent("pageChange",d1,this);e1._oMinDate.setYear(this._oMinDate.getUTCFullYear());e1._oMaxDate.setYear(this._oMaxDate.getUTCFullYear());return e1;};m.prototype.exit=function(){if(this._sInvalidateContent){clearTimeout(this._sInvalidateContent);}};m.prototype.onBeforeRendering=function(){var e1=this.getAggregation("timesRow");var f1=this._getFocusedDate();y.call(this);e1.displayDate(a._createLocalDate(f1,true));};m.prototype._setAriaRole=function(e1){var f1=this.getAggregation("timesRow");f1._setAriaRole(e1);f1.invalidate();return this;};m.prototype._getCalendarPicker=function(){var e1=this.getAggregation("calendarPicker");if(!e1){e1=new k(this.getId()+"--Cal",{});e1.setPopupMode(true);e1.attachEvent("select",O,this);e1.attachEvent("cancel",function(f1){this._oPopup.close();var g1=this.getAggregation("header").getDomRef("B1");if(g1){g1.focus();}},this);this.setAggregation("calendarPicker",e1);}return e1;};m.prototype.setStartDate=function(e1){a._checkJSDateObject(e1);if(h(this.getStartDate(),e1)){return this;}var f1=e1.getFullYear();a._checkYearInValidRange(f1);var g1=this.getMinDate();if(g1&&e1.getTime()<g1.getTime()){i.warning("startDate < minDate -> minDate as startDate set",this);e1=new Date(g1);}var h1=this.getMaxDate();if(h1&&e1.getTime()>h1.getTime()){i.warning("startDate > maxDate -> maxDate as startDate set",this);e1=new Date(h1);}this.setProperty("startDate",e1,true);var i1=this.getAggregation("timesRow");i1.setStartDate(e1);this._oUTCStartDate=new U(i1._getStartDate().getTime());y.call(this);var j1=a._createLocalDate(this._getFocusedDate(),true);if(!i1.checkDateFocusable(j1)){this._setFocusedDate(this._oUTCStartDate);i1.displayDate(e1);}return this;};m.prototype.invalidate=function(e1){if(!this._bDateRangeChanged&&(!e1||!(e1 instanceof j))){if(!e1||(!(e1 instanceof D||e1 instanceof M||e1 instanceof Y||e1 instanceof H))){C.prototype.invalidate.apply(this,arguments);}}else if(this.getDomRef()&&this._iMode==0&&!this._sInvalidateContent){this._sInvalidateContent=setTimeout(W.bind(this),0);}};m.prototype.removeAllSelectedDates=function(){this._bDateRangeChanged=true;var e1=this.removeAllAggregation("selectedDates");return e1;};m.prototype.destroySelectedDates=function(){this._bDateRangeChanged=true;var e1=this.destroyAggregation("selectedDates");return e1;};m.prototype.removeAllSpecialDates=function(){this._bDateRangeChanged=true;var e1=this.removeAllAggregation("specialDates");return e1;};m.prototype.destroySpecialDates=function(){this._bDateRangeChanged=true;var e1=this.destroyAggregation("specialDates");return e1;};m.prototype.setIntervalMinutes=function(e1){if(e1>=720){throw new Error("Only intervals < 720 minutes are allowed; "+this);}if(1440%e1>0){throw new Error("A day must be divisible by the interval size; "+this);}this.setProperty("intervalMinutes",e1,false);var f1=this.getAggregation("timesRow");var g1=a._createLocalDate(this._getFocusedDate(),true);if(!f1.checkDateFocusable(g1)){var h1=n.call(this);this._setFocusedDate(h1);f1.setDate(a._createLocalDate(h1,true));}return this;};m.prototype.setLocale=function(e1){if(this._sLocale!=e1){this._sLocale=e1;this._oLocaleData=undefined;this.invalidate();}return this;};m.prototype.getLocale=function(){if(!this._sLocale){this._sLocale=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale().toString();}return this._sLocale;};m.prototype._getFocusedDate=function(){if(!this._oFocusedDate){p.call(this);}return this._oFocusedDate;};m.prototype._setFocusedDate=function(e1){if(!(e1 instanceof U)){throw new Error("Date must be a UniversalDate object "+this);}this._oFocusedDate=new U(e1.getTime());};m.prototype.focusDate=function(e1){var f1=false;var g1=this.getAggregation("timesRow");if(!g1.checkDateFocusable(e1)){var h1=a._createUniversalUTCDate(e1,undefined,true);X.call(this,h1);f1=true;}F.call(this,e1,false);if(f1){this.fireStartDateChange();}return this;};m.prototype.displayDate=function(e1){F.call(this,e1,true);return this;};m.prototype.setItems=function(e1){this.setProperty("items",e1,true);e1=this._getItems();var f1=this.getAggregation("timesRow");f1.setItems(e1);var g1=a._createLocalDate(this._getFocusedDate(),true);if(!f1.checkDateFocusable(g1)){var h1=n.call(this);this._setFocusedDate(h1);f1.setDate(a._createLocalDate(h1,true));}if(!this.getPickerPopup()){var i1=this.getAggregation("datesRow");var j1=Math.floor(e1*1.5);if(j1>31){j1=31;}i1.setDays(j1);var k1=this.getAggregation("monthPicker");var l1=Math.floor(e1/2);if(l1>12){l1=12;}k1.setMonths(l1);var m1=this.getAggregation("yearPicker");var n1=Math.floor(e1/2);if(n1>20){n1=20;}m1.setYears(n1);}y.call(this);if(this.getDomRef()){if(this._getShowItemHeader()){this.$().addClass("sapUiCalIntHead");}else{this.$().removeClass("sapUiCalIntHead");}}return this;};m.prototype._getItems=function(){var e1=this.getItems();if(c.system.phone&&e1>6){return 6;}else{return e1;}};m.prototype._getLocaleData=function(){if(!this._oLocaleData){var e1=this.getLocale();var f1=new d(e1);this._oLocaleData=L.getInstance(f1);}return this._oLocaleData;};m.prototype.setPickerPopup=function(e1){var f1=this.getAggregation("header"),g1,h1,i1;this.setProperty("pickerPopup",e1,true);if(g1){g1.destroy();}if(e1){f1.setVisibleButton0(false);f1.setVisibleButton1(true);f1.setVisibleButton2(false);f1.detachEvent("pressButton1",I,this);f1.attachEvent("pressButton1",I,this);if(this.getAggregation("datesRow")){this.getAggregation("datesRow").destroy();}if(this.getAggregation("monthPicker")){this.getAggregation("monthPicker").destroy();}if(this.getAggregation("yearPicker")){this.getAggregation("yearPicker").destroy();}}else{f1.setVisibleButton0(true);f1.setVisibleButton1(true);f1.setVisibleButton2(true);f1.detachEvent("pressButton0",G,this);f1.attachEvent("pressButton0",G,this);f1.detachEvent("pressButton1",I,this);f1.attachEvent("pressButton1",I,this);f1.detachEvent("pressButton2",J,this);f1.attachEvent("pressButton2",J,this);if(!this.getAggregation("datesRow")){this.setAggregation("datesRow",this._createDatesRow());}if(!this.getAggregation("yearPicker")){this.setAggregation("yearPicker",this._createYearPicker());}if(!this.getAggregation("monthPicker")){this.setAggregation("monthPicker",this._createMonthPicker());}h1=this.getAggregation("monthPicker");i1=this.getAggregation("yearPicker");h1.setColumns(0);h1.setMonths(6);i1.setColumns(0);i1.setYears(6);}return this;};m.prototype.setMinDate=function(e1){var f1,g1,h1,i1;if(h(e1,this.getMinDate())){return this;}if(!e1){a._updateUTCDate(this._oMinDate.getJSDate(),1,0,1,0,0,0,0);}else{a._checkJSDateObject(e1);this._oMinDate=a._createUniversalUTCDate(e1,undefined,true);f1=this.getAggregation("timesRow");this._oMinDate=f1._getIntervalStart(this._oMinDate);g1=this._oMinDate.getUTCFullYear();a._checkYearInValidRange(g1);if(this._oMaxDate.getTime()<this._oMinDate.getTime()){i.warning("minDate > maxDate -> maxDate set to end of the month",this);this._oMaxDate=a._createUniversalUTCDate(e1,undefined,true);a._updateUTCDate(this._oMaxDate,null,this._oMaxDate.getUTCMonth()+1,0,23,59,59,0);this.setProperty("maxDate",a._createLocalDate(this._oMaxDate,true),true);}if(this._oFocusedDate){if(this._oFocusedDate.getTime()<this._oMinDate.getTime()){i.warning("focused date < minDate -> minDate focused",this);this.focusDate(e1);}}if(this._oUTCStartDate&&this._oUTCStartDate.getTime()<this._oMinDate.getTime()){i.warning("start date < minDate -> minDate set as start date",this);_.call(this,new U(this._oMinDate.getTime()),true,true);}}this.setProperty("minDate",e1,false);if(this.getPickerPopup()){i1=this._getCalendarPicker();i1.setMinDate(e1);}else{h1=this.getAggregation("yearPicker");h1._oMinDate.setYear(this._oMinDate.getUTCFullYear());}return this;};m.prototype.setMaxDate=function(e1){var f1,g1,h1,i1,j1,k1;if(h(e1,this.getMaxDate())){return this;}if(!e1){a._updateUTCDate(this._oMaxDate.getJSDate(),9999,11,31,23,59,59,0);}else{a._checkJSDateObject(e1);this._oMaxDate=a._createUniversalUTCDate(e1,undefined,true);f1=this.getAggregation("timesRow");this._oMaxDate=f1._getIntervalStart(this._oMaxDate);this._oMaxDate.setUTCMinutes(this._oMaxDate.getUTCMinutes()+this.getIntervalMinutes());this._oMaxDate.setUTCMilliseconds(-1);g1=this._oMaxDate.getUTCFullYear();a._checkYearInValidRange(g1);if(this._oMinDate.getTime()>this._oMaxDate.getTime()){i.warning("maxDate < minDate -> minDate set to begin of the month",this);this._oMinDate=a._createUniversalUTCDate(e1,undefined,true);a._updateUTCDate(this._oMinDate,null,null,1,0,0,0,0);this.setProperty("minDate",a._createLocalDate(this._oMinDate,true),true);}if(this._oFocusedDate){if(this._oFocusedDate.getTime()>this._oMaxDate.getTime()){i.warning("focused date > maxDate -> maxDate focused",this);this.focusDate(e1);}}if(this._oUTCStartDate){h1=new U(this._oUTCStartDate.getTime());h1.setUTCMinutes(h1.getUTCMinutes()+this.getIntervalMinutes()*(this._getItems()-1));if(h1.getTime()>this._oMaxDate.getTime()){i1=new U(this._oMaxDate.getTime());i1.setUTCMinutes(i1.getUTCMinutes()-this.getIntervalMinutes()*(this._getItems()-1));if(i1.getTime()>=this._oMinDate.getTime()){i.warning("end date > maxDate -> maxDate set as end date",this);_.call(this,i1,true,true);}}}}this.setProperty("maxDate",e1,false);if(this.getPickerPopup()){k1=this._getCalendarPicker();k1.setMaxDate(e1);}else{j1=this.getAggregation("yearPicker");j1._oMaxDate.setYear(this._oMaxDate.getUTCFullYear());}return this;};m.prototype.onclick=function(e1){if(e1.isMarked("delayedMouseEvent")){return;}if(e1.target.id==this.getId()+"-cancel"){this.onsapescape(e1);}};m.prototype.onmousedown=function(e1){e1.preventDefault();e1.setMark("cancelAutoClose");};m.prototype.onsapescape=function(e1){if(this.getPickerPopup()){r.call(this);this.fireCancel();}else{switch(this._iMode){case 0:this.fireCancel();break;case 1:t.call(this);break;case 2:v.call(this);break;case 3:x.call(this);break;}}};m.prototype.onsaptabnext=function(e1){var f1=this.getAggregation("header"),g1,h1,i1;if(g(this.getDomRef("content"),e1.target)){if(this.getPickerPopup()&&f1.getDomRef("B1")){f1.getDomRef("B1").focus();}else if(!this.getPickerPopup()&&f1.getDomRef("B0")){f1.getDomRef("B0").focus();}if(!this._bPoupupMode){i1=this.getAggregation("timesRow");q(i1._oItemNavigation.getItemDomRefs()[i1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");if(!this.getPickerPopup()){g1=this.getAggregation("monthPicker");h1=this.getAggregation("yearPicker");if(g1.getDomRef()){q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(h1.getDomRef()){q(h1._oItemNavigation.getItemDomRefs()[h1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}}e1.preventDefault();}else if(e1.target.id==f1.getId()+"-B0"){if(f1.getDomRef("B1")){f1.getDomRef("B1").focus();}e1.preventDefault();}else if(!this.getPickerPopup()&&(e1.target.id==f1.getId()+"-B1")){if(f1.getDomRef("B2")){f1.getDomRef("B2").focus();}e1.preventDefault();}};m.prototype.onsaptabprevious=function(e1){var f1=this.getAggregation("header"),g1,h1,i1;if(g(this.getDomRef("content"),e1.target)){if(this._bPoupupMode){if(f1.getDomRef("B2")){f1.getDomRef("B2").focus();}e1.preventDefault();}}else if(e1.target.id==f1.getId()+"-B0"){i1=this.getAggregation("timesRow");switch(this._iMode){case 0:i1._oItemNavigation.focusItem(i1._oItemNavigation.getFocusedIndex());break;case 2:if(!this.getPickerPopup()){g1=this.getAggregation("monthPicker");g1._oItemNavigation.focusItem(g1._oItemNavigation.getFocusedIndex());}break;case 3:if(!this.getPickerPopup()){h1=this.getAggregation("yearPicker");h1._oItemNavigation.focusItem(h1._oItemNavigation.getFocusedIndex());}break;}e1.preventDefault();}else if(e1.target.id==f1.getId()+"-B2"){if(f1.getDomRef("B1")){f1.getDomRef("B1").focus();}e1.preventDefault();}else if(e1.target.id==f1.getId()+"-B1"){if(!this.getPickerPopup()){if(f1.getDomRef("B0")){f1.getDomRef("B0").focus();}}else{i1=this.getAggregation("timesRow");i1._oItemNavigation.focusItem(i1._oItemNavigation.getFocusedIndex());}e1.preventDefault();}};m.prototype.onfocusin=function(e1){if(e1.target.id==this.getId()+"-end"){var f1=this.getAggregation("header"),g1,h1,i1;if(this.getPickerPopup()&&f1.getDomRef("B1")){f1.getDomRef("B1").focus();}else if(!this.getPickerPopup()&&f1.getDomRef("B2")){f1.getDomRef("B2").focus();}if(!this._bPoupupMode){g1=this.getAggregation("timesRow");q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");if(!this.getPickerPopup()){h1=this.getAggregation("monthPicker");i1=this.getAggregation("yearPicker");if(h1.getDomRef()){q(h1._oItemNavigation.getItemDomRefs()[h1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}if(i1.getDomRef()){q(i1._oItemNavigation.getItemDomRefs()[i1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}}}}this.$("end").attr("tabindex","-1");};m.prototype.onsapfocusleave=function(e1){if(!e1.relatedControlId||!g(this.getDomRef(),sap.ui.getCore().byId(e1.relatedControlId).getFocusDomRef())){this.$("end").attr("tabindex","0");if(!this._bPoupupMode){var f1,g1,h1;switch(this._iMode){case 0:f1=this.getAggregation("timesRow");q(f1._oItemNavigation.getItemDomRefs()[f1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");break;case 2:if(!this.getPickerPopup()){g1=this.getAggregation("monthPicker");q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}break;case 3:if(!this.getPickerPopup()){h1=this.getAggregation("yearPicker");q(h1._oItemNavigation.getItemDomRefs()[h1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}break;}}}};m.prototype._handlePrevious=function(e1){var f1=this._getFocusedDate(),g1,h1,i1,j1,k1,l1,m1,n1;switch(this._iMode){case 0:g1=this._getItems();h1=new U(n.call(this).getTime());i1=this.getIntervalMinutes();h1.setUTCMinutes(h1.getUTCMinutes()-g1*i1);f1.setUTCMinutes(f1.getUTCMinutes()-g1*i1);this._setFocusedDate(f1);_.call(this,h1,true);break;case 1:if(!this.getPickerPopup()){j1=this.getAggregation("datesRow");k1=a._createUniversalUTCDate(j1.getDate());l1=j1.getDays();if(k1.getUTCDate()<=l1){k1.setUTCDate(1);}else{k1.setUTCDate(k1.getUTCDate()-l1);}Z.call(this,k1);}break;case 2:if(!this.getPickerPopup()){m1=this.getAggregation("monthPicker");if(m1.getMonths()<12){m1.previousPage();z.call(this);}else{f1.setUTCFullYear(f1.getUTCFullYear()-1);X.call(this,f1);this._setFocusedDate(f1);y.call(this);b1.call(this,f1.getUTCFullYear(),m1);this.fireStartDateChange();}}break;case 3:if(!this.getPickerPopup()){n1=this.getAggregation("yearPicker");n1.previousPage();A.call(this);}break;}};m.prototype._handleNext=function(e1){var f1=this._getFocusedDate();switch(this._iMode){case 0:var g1=this._getItems();var h1=new U(n.call(this).getTime());var i1=this.getIntervalMinutes();h1.setUTCMinutes(h1.getUTCMinutes()+g1*i1);f1.setUTCMinutes(f1.getUTCMinutes()+g1*i1);this._setFocusedDate(f1);_.call(this,h1,true);break;case 1:if(!this.getPickerPopup()){var j1=this.getAggregation("datesRow");var k1=a._createUniversalUTCDate(j1.getDate());var l1=new U(k1.getTime());l1.setUTCDate(1);l1.setUTCMonth(l1.getUTCMonth()+1);l1.setUTCDate(0);var m1=j1.getDays();if(k1.getUTCDate()+m1>l1.getUTCDate()){k1.setUTCDate(l1.getUTCDate());}else{k1.setUTCDate(k1.getUTCDate()+m1);}Z.call(this,k1);}break;case 2:if(!this.getPickerPopup()){var n1=this.getAggregation("monthPicker");if(n1.getMonths()<12){n1.nextPage();z.call(this);}else{f1.setUTCFullYear(f1.getUTCFullYear()+1);X.call(this,f1);this._setFocusedDate(f1);y.call(this);b1.call(this,f1.getUTCFullYear(),n1);this.fireStartDateChange();}}break;case 3:if(!this.getPickerPopup()){var o1=this.getAggregation("yearPicker");o1.nextPage();A.call(this);}break;}};m.prototype._getShowItemHeader=function(){var e1=this.getItems();if(e1>this._iItemsHead){return true;}else{return false;}};function _(e1,f1,g1){var h1=new U(this._oMaxDate.getTime());h1.setUTCMinutes(h1.getUTCMinutes()-this.getIntervalMinutes()*(this._getItems()-1));if(h1.getTime()<this._oMinDate.getTime()){h1=new U(this._oMinDate.getTime());h1.setUTCMinutes(h1.getUTCMinutes()+this.getIntervalMinutes()*(this._getItems()-1));}if(e1.getTime()<this._oMinDate.getTime()){e1=new U(this._oMinDate.getTime());}else if(e1.getTime()>h1.getTime()){e1=h1;}var i1=this.getAggregation("timesRow");var j1=a._createLocalDate(e1,true);i1.setStartDate(j1);this._oUTCStartDate=new U(i1._getStartDate().getTime());j1=a._createLocalDate(this._oUTCStartDate,true);this.setProperty("startDate",j1,true);y.call(this);if(f1){var k1=a._createLocalDate(this._getFocusedDate(),true);if(!i1.checkDateFocusable(k1)){this._setFocusedDate(e1);i1.setDate(j1);}else{i1.setDate(k1);}}if(!g1){this.fireStartDateChange();}}function n(){if(!this._oUTCStartDate){var e1=this.getAggregation("timesRow");e1.setStartDate(a._createLocalDate(this._getFocusedDate(),true));this._oUTCStartDate=new U(e1._getStartDate().getTime());this._setFocusedDate(this._oUTCStartDate);}return this._oUTCStartDate;}function o(e1){var f1=this._getFocusedDate();var g1=this.getAggregation("timesRow");if(!e1){g1.setDate(a._createLocalDate(f1,true));}else{g1.displayDate(a._createLocalDate(f1,true));}y.call(this);}function p(){var e1=this.getSelectedDates();if(e1&&e1[0]&&e1[0].getStartDate()){this._oFocusedDate=a._createUniversalUTCDate(e1[0].getStartDate(),undefined,true);}else{var f1=new Date();this._oFocusedDate=a._createUniversalUTCDate(f1,undefined,true);}if(this._oFocusedDate.getTime()<this._oMinDate.getTime()){this._oFocusedDate=new U(this._oMinDate.getTime());}else if(this._oFocusedDate.getTime()>this._oMaxDate.getTime()){this._oFocusedDate=new U(this._oMaxDate.getTime());}}m.prototype._showCalendarPicker=function(){var e1=a._createLocalDate(this._getFocusedDate(),true);var f1=this._getCalendarPicker();var g1=new j({startDate:e1});f1.displayDate(e1,false);f1.removeAllSelectedDates();f1.addSelectedDate(g1);f1.setMinDate(this.getMinDate());f1.setMaxDate(this.getMaxDate());$.call(this,f1);this._showOverlay();};m.prototype._showOverlay=function(){this.$("contentOver").css("display","");};m.prototype._hideOverlay=function(){this.$("contentOver").css("display","none");};function r(e1){if(this._oPopup&&this._oPopup.isOpen()){this._oPopup.close();}this._hideOverlay();if(!e1){o.call(this);var f1=this.getAggregation("timesRow");q(f1._oItemNavigation.getItemDomRefs()[f1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}this.getAggregation("calendarPicker")._closedPickers();}function s(){if(this._iMode==3){x.call(this,true);}else if(this._iMode==2){v.call(this,true);}var e1=this._getFocusedDate();var f1=this._getItems();var g1=this.getAggregation("datesRow");var h1=g1.getSelectedDates()[0];h1.setStartDate(a._createLocalDate(e1,true));var i1=new U(e1.getTime());i1.setUTCDate(1);i1.setUTCMonth(i1.getUTCMonth()+1);i1.setUTCDate(0);var j1=i1.getUTCDate();var k1=Math.floor(f1*1.5);if(k1>j1){k1=j1;}g1.setDays(k1);if(g1.getDomRef()){g1.$().css("display","");}else{var l1=sap.ui.getCore().createRenderManager();var m1=this.$("content");l1.renderControl(g1);l1.flush(m1[0],false,true);l1.destroy();}this._showOverlay();Z.call(this,e1);if(this._iMode==0){var n1=this.getAggregation("timesRow");q(n1._oItemNavigation.getItemDomRefs()[n1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}this._iMode=1;}function t(e1){this._iMode=0;var f1=this.getAggregation("datesRow");f1.$().css("display","none");this._hideOverlay();if(!e1){o.call(this);var g1=this.getAggregation("timesRow");q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}function u(){if(this._iMode==1){t.call(this,true);}else if(this._iMode==3){x.call(this,true);}var e1=this._getFocusedDate();var f1=this.getAggregation("monthPicker");if(f1.getDomRef()){f1.$().css("display","");}else{var g1=sap.ui.getCore().createRenderManager();var h1=this.$("content");g1.renderControl(f1);g1.flush(h1[0],false,true);g1.destroy();}this._showOverlay();f1.setMonth(e1.getUTCMonth());b1.call(this,e1.getUTCFullYear(),f1);if(this._iMode==0){var i1=this.getAggregation("timesRow");q(i1._oItemNavigation.getItemDomRefs()[i1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}this._iMode=2;z.call(this);}function v(e1){this._iMode=0;var f1=this.getAggregation("monthPicker");f1.$().css("display","none");this._hideOverlay();if(!e1){o.call(this);var g1=this.getAggregation("timesRow");q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}function w(){if(this._iMode==1){t.call(this,true);}else if(this._iMode==2){v.call(this,true);}var e1=this._getFocusedDate();var f1=this.getAggregation("yearPicker");if(f1.getDomRef()){f1.$().css("display","");}else{var g1=sap.ui.getCore().createRenderManager();var h1=this.$("content");g1.renderControl(f1);g1.flush(h1[0],false,true);g1.destroy();}this._showOverlay();f1.setDate(e1.getJSDate());if(this._iMode==0){var i1=this.getAggregation("timesRow");q(i1._oItemNavigation.getItemDomRefs()[i1._oItemNavigation.getFocusedIndex()]).attr("tabindex","-1");}A.call(this);this._iMode=3;}function x(e1){this._iMode=0;var f1=this.getAggregation("yearPicker");f1.$().css("display","none");this._hideOverlay();if(!e1){o.call(this);var g1=this.getAggregation("timesRow");q(g1._oItemNavigation.getItemDomRefs()[g1._oItemNavigation.getFocusedIndex()]).attr("tabindex","0");}}function y(){B.call(this);z.call(this,true);}function z(e1){var f1=new U(n.call(this).getTime());var g1=this._getItems();var h1=f1.getJSDate().getUTCFullYear();var i1=this._oMaxDate.getJSDate().getUTCFullYear();var j1=this._oMinDate.getJSDate().getUTCFullYear();var k1=f1.getJSDate().getUTCMonth();var l1=this._oMaxDate.getJSDate().getUTCMonth();var m1=this._oMinDate.getJSDate().getUTCMonth();var n1=f1.getJSDate().getUTCDate();var o1=this._oMaxDate.getJSDate().getUTCDate();var p1=this._oMinDate.getJSDate().getUTCDate();var q1=f1.getJSDate().getUTCHours();var r1=this._oMaxDate.getJSDate().getUTCHours();var s1=this._oMinDate.getJSDate().getUTCHours();var t1=f1.getJSDate().getUTCMinutes();var u1=this._oMaxDate.getJSDate().getUTCMinutes();var v1=this._oMinDate.getJSDate().getUTCMinutes();var w1=this.getAggregation("header");if(this._iMode==2&&!e1){var x1=this.getAggregation("monthPicker");var y1=x1.getMonths();var z1=x1.getStartMonth();var A1=z1+y1-1;if(z1==0||(h1==j1&&z1<=m1)){w1.setEnabledPrevious(false);}else{w1.setEnabledPrevious(true);}if(A1>10||(h1==i1&&A1>=l1)){w1.setEnabledNext(false);}else{w1.setEnabledNext(true);}return;}if((h1<j1||(h1==j1&&(!e1||(k1<m1||(k1==m1&&(n1<p1||(n1==p1&&(q1<s1||(q1==s1&&t1<=v1)))))))))||((this._iMode==1||this._iMode==2)&&this.getPickerPopup())){w1.setEnabledPrevious(false);}else{w1.setEnabledPrevious(true);}f1.setUTCMinutes(f1.getUTCMinutes()+(g1)*this.getIntervalMinutes()-1);h1=f1.getJSDate().getUTCFullYear();k1=f1.getJSDate().getUTCMonth();n1=f1.getJSDate().getUTCDate();q1=f1.getJSDate().getUTCHours();t1=f1.getJSDate().getUTCMinutes();if((h1>i1||(h1==i1&&(!e1||(k1>l1||(k1==l1&&(n1>o1||(n1==o1&&(q1>r1||(q1==r1&&t1>=u1)))))))))||((this._iMode==1||this._iMode==2)&&this.getPickerPopup())){w1.setEnabledNext(false);}else{w1.setEnabledNext(true);}}function A(){var e1=this.getAggregation("yearPicker");var f1=e1.getYears();var g1=a._createUniversalUTCDate(e1.getFirstRenderedDate());g1.setUTCFullYear(g1.getUTCFullYear()+Math.floor(f1/2));var h1=this.getAggregation("header");var i1=new U(this._oMaxDate);i1.setUTCFullYear(i1.getUTCFullYear()-Math.ceil(f1/2));i1.setUTCMonth(11,31);var j1=new U(this._oMinDate);j1.setUTCFullYear(j1.getUTCFullYear()+Math.floor(f1/2)+1);j1.setUTCMonth(0,1);if(g1.getTime()>i1.getTime()){h1.setEnabledNext(false);}else{h1.setEnabledNext(true);}if(g1.getTime()<j1.getTime()){h1.setEnabledPrevious(false);}else{h1.setEnabledPrevious(true);}}function B(){var e1=this.getAggregation("header");var f1;var g1=n.call(this);var h1;var i1=this._getLocaleData();var j1=[];var k1=[];var l1;var m1=false;var n1;var o1=false;if(i1.oLocale.sLanguage.toLowerCase()==="ja"||i1.oLocale.sLanguage.toLowerCase()==="zh"){n1=b.getDateInstance({format:"d"}).format(g1,true);}else{n1=(g1.getUTCDate()).toString();}if(this._bLongMonth||!this._bNamesLengthChecked){j1=i1.getMonthsStandAlone("wide");}else{m1=true;j1=i1.getMonthsStandAlone("abbreviated");k1=i1.getMonthsStandAlone("wide");}var p1=g1.getUTCMonth();f1=j1[p1];if(m1){l1=k1[j1[p1]];}if(!this.getPickerPopup()){e1.setTextButton0(n1);e1.setTextButton1(f1);e1.setTextButton2(this._oYearFormat.format(g1,true));}else{h1=b.getInstance({style:"long",strictParsing:true,relative:o1},i1.oLocale);l1=n1=h1.format(a._createLocalDate(g1,true));e1.setTextButton1(n1);}if(m1){e1.setAriaLabelButton1(l1);}}function E(e1,f1){var g1;var h1=false;if(e1.getTime()<this._oMinDate.getTime()){g1=this._oMinDate;h1=true;}else if(e1.getTime()>this._oMaxDate.getTime()){g1=this._oMaxDate;h1=true;}else{g1=e1;}this._setFocusedDate(g1);if(h1||f1){X.call(this,g1);o.call(this,false);this.fireStartDateChange();}}function F(e1,f1){if(e1&&(!this._oFocusedDate||this._oFocusedDate.getTime()!=e1.getTime())){a._checkJSDateObject(e1);e1=a._createUniversalUTCDate(e1,undefined,true);var g1=e1.getUTCFullYear();a._checkYearInValidRange(g1);if(e1.getTime()<this._oMinDate.getTime()||e1.getTime()>this._oMaxDate.getTime()){throw new Error("Date must not be in valid range (minDate and maxDate); "+this);}this._setFocusedDate(e1);if(this.getDomRef()&&this._iMode==0){o.call(this,f1);}}}function G(e1){if(this._iMode!=1){s.call(this);}else{t.call(this);}}function I(e1){if(this.getPickerPopup()){this._showCalendarPicker();}else{if(this._iMode!=2){u.call(this);}else{v.call(this);}}}function J(e1){if(this._iMode!=3){w.call(this);}else{x.call(this);}}function K(e1){this.fireSelect();}function N(e1){var f1=a._createUniversalUTCDate(e1.getParameter("date"),undefined,true);var g1=e1.getParameter("notVisible");E.call(this,f1,g1);}function O(e1){var f1=e1.getSource(),g1=f1.getSelectedDates()[0].getStartDate();var h1=new U(this._getFocusedDate().getTime());var i1=a._createUniversalUTCDate(g1);h1.setUTCFullYear(i1.getUTCFullYear());h1.setUTCMonth(i1.getUTCMonth(),i1.getUTCDate());E.call(this,h1,true);r.call(this);}function Q(e1){var f1=new U(this._getFocusedDate().getTime());var g1=e1.oSource;var h1=g1.getSelectedDates()[0];var i1=a._createUniversalUTCDate(h1.getStartDate());if(!this.getPickerPopup()||i1.getUTCMonth()==f1.getUTCMonth()){f1.setUTCDate(i1.getUTCDate());f1.setUTCMonth(i1.getUTCMonth());f1.setUTCFullYear(i1.getUTCFullYear());E.call(this,f1,true);t.call(this);}}function R(e1){var f1=new U(this._getFocusedDate().getTime());var g1=a._createUniversalUTCDate(e1.getParameter("date"),undefined,true);var h1=e1.getParameter("otherMonth");if(h1&&g1.getUTCMonth()==f1.getUTCMonth()&&g1.getUTCFullYear()==f1.getUTCFullYear()){Z.call(this,g1);}}function S(e1){var f1=new U(this._getFocusedDate().getTime());var g1=this.getAggregation("monthPicker");var h1=g1.getMonth();f1.setUTCMonth(h1);if(h1!=f1.getUTCMonth()){f1.setUTCDate(0);}E.call(this,f1,true);v.call(this);}function V(e1){var f1=new U(this._getFocusedDate().getTime());var g1=this.getAggregation("yearPicker");var h1=a._createUniversalUTCDate(g1.getDate());var i1=f1.getUTCMonth();h1.setUTCMonth(f1.getUTCMonth(),f1.getUTCDate());h1.setUTCHours(f1.getUTCHours());h1.setUTCMinutes(f1.getUTCMinutes());f1=h1;if(i1!=f1.getUTCMonth()){f1.setUTCDate(0);}E.call(this,f1,true);x.call(this);}function W(){this._sInvalidateContent=undefined;var e1=this.getAggregation("timesRow");e1._bDateRangeChanged=true;e1._bInvalidateSync=true;e1.invalidate();e1._bInvalidateSync=undefined;this._bDateRangeChanged=undefined;}function X(e1){var f1=this.getAggregation("timesRow");var g1=n.call(this);var h1=f1._oItemNavigation.getFocusedIndex();g1=new U(e1.getTime());g1.setUTCMinutes(g1.getUTCMinutes()-h1*this.getIntervalMinutes());_.call(this,g1,false,true);}function Z(e1){var f1=this.getAggregation("datesRow");var g1=this.getAggregation("header");if(!this.getPickerPopup()){var h1=new U(e1.getTime());h1.setUTCDate(1);h1.setUTCMonth(h1.getUTCMonth()+1);h1.setUTCDate(0);var i1=f1.getDays();var j1=new U(e1.getTime());j1.setUTCDate(1+(Math.ceil(e1.getUTCDate()/i1)-1)*i1);if(h1.getUTCDate()-j1.getUTCDate()<i1){j1.setUTCDate(h1.getUTCDate()-i1+1);}f1.setStartDate(a._createLocalDate(j1,true));var k1=j1.getJSDate().getUTCFullYear();var l1=this._oMaxDate.getJSDate().getUTCFullYear();var m1=this._oMinDate.getJSDate().getUTCFullYear();var n1=j1.getJSDate().getUTCMonth();var o1=this._oMaxDate.getJSDate().getUTCMonth();var p1=this._oMinDate.getJSDate().getUTCMonth();var q1=j1.getJSDate().getUTCDate();var r1=this._oMaxDate.getJSDate().getUTCDate();var s1=this._oMinDate.getJSDate().getUTCDate();if(q1<=1||(k1==m1&&n1==p1&&q1<=s1)){g1.setEnabledPrevious(false);}else{g1.setEnabledPrevious(true);}if((q1+i1)>=h1.getUTCDate()||(k1==l1&&n1==o1&&q1>=r1)){g1.setEnabledNext(false);}else{g1.setEnabledNext(true);}}else{g1.setEnabledPrevious(false);g1.setEnabledNext(false);}f1.setDate(a._createLocalDate(e1,true));}function $(e1){if(!this._oPopup){this._oPopup=new P();this._oPopup.setAutoClose(true);this._oPopup.setAutoCloseAreas([this.getDomRef()]);this._oPopup.setDurations(0,0);this._oPopup._oCalendar=this;this._oPopup.attachClosed(a1,this);this._oPopup.onsapescape=function(h1){this._oCalendar.onsapescape(h1);};}this._oPopup.setContent(e1);var f1=this.getAggregation("header");var g1=P.Dock;this._oPopup.open(0,g1.CenterTop,g1.CenterTop,f1,null,"flipfit",true);}function a1(e1){r.call(this);}function b1(e1,f1){var g1=0;var h1=11;if(e1==this._oMinDate.getUTCFullYear()){g1=this._oMinDate.getUTCMonth();}if(e1==this._oMaxDate.getUTCFullYear()){h1=this._oMaxDate.getUTCMonth();}f1.setMinMax(g1,h1);}function c1(e1){z.call(this);}function d1(e1){A.call(this);}return m;});
