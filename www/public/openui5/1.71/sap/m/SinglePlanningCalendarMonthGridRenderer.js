/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/unified/calendar/CalendarDate','sap/ui/unified/calendar/CalendarUtils','sap/ui/unified/calendar/Month','sap/ui/core/date/UniversalDate','./PlanningCalendarLegend','sap/ui/core/InvisibleText','sap/ui/core/Core','sap/ui/unified/library'],function(C,a,M,U,P,I,b,u){"use strict";var c=u.CalendarDayType;var S={};S.render=function(r,o){var l=o._getCoreLocaleData();var d=o._getDensitySizes();r.write("<div");r.writeControlData(o);r.addClass("sapMSinglePCGrid");r.addClass("sapMSPCMonthGrid");r.writeClasses();r.write(">");this.renderDayNames(r,o,l);r.write("<div");r.addClass("sapMSinglePCGridContent");r.writeClasses();r.write(">");this.renderCells(r,o,l,d);r.write("</div>");r.write("</div>");};S.renderCells=function(r,o,l,d){var e=o._getCells(),v=o._getVerticalLabels(),f=o._getColumns(),m=[],A=[],g,D,h,p,k=[],n,w;for(var i=0;i<o._getRows();i++){w=0;r.write("<div");r.writeAttribute("role","grid");r.addClass("sapMSPCMonthWeek");r.writeClasses();r.write(">");r.write("<div");r.addClass("sapMSPCMonthWeekNumber");r.writeClasses();r.write(">");r.write(v[i]);r.write("</div>");for(var j=0;j<f;j++){g=i*f+j;D=e[g];h=o._getAppointmetsForADay(D);p=o._getPreviousAppointmetsForADay(D);k.push(p);n=o._getMoreCountPerCell(g);m.push(n);A.push(h);w=Math.max(w,o._aAppsLevelsPerDay[g].length);}r.write("<div");r.addClass("sapMSPCMonthDays");r.addClass("sapMSPCMonthDaysMax"+w);r.writeClasses();r.write(">");for(var j=0;j<f;j++){g=i*f+j;D=e[g];this.renderDay(r,o,D,l,m[g],g);}r.write("<div");r.addClass("sapMSinglePCBlockers");r.addClass("sapUiCalendarRowVisFilled");r.writeClasses();r.write(">");for(var j=0;j<f;j++){g=i*f+j;D=e[g];if(j===0){this.renderAppointments(r,o,k[g],j,m[g],d);}this.renderAppointments(r,o,A[g],j,m[g],d);}r.write("</div>");r.write("</div>");r.write("</div>");}};S.renderDay=function(r,o,d,l,m,i){var s=o.getSpecialDates(),D=M.prototype._getDateTypes.call(o,d),f=o._getDateFormatter(),t,L;r.write("<div");r.addClass("sapMSPCMonthDay");if(a._isWeekend(d,l)){r.addClass("nonWorkingTimeframe");}if(s){if(D&&D[0]){t=D[0];r.addClass("sapUiCalendarSpecialDay"+t.type);L=P.findLegendItemForItem(b.byId(o._sLegendId),t);}}r.writeClasses();r.writeAttribute("sap-ui-date",d.valueOf().toString());r.writeAttribute("tabindex",-1);r.writeAttribute("aria-labelledby",f.format(d.toLocalJSDate())+"-Descr");r.write(">");this.renderDndPlaceholder(r,o.getAggregation("_appsPlaceholders")[i]);r.write("<div");r.addClass("specialDateIndicator");r.writeClasses();r.write(">");r.write("</div>");r.write("<div");r.addClass("sapMSPCMonthDayNumber");r.writeClasses();r.write(">");r.write(d.getDate());r.write("</div>");if(m){r.write("<div");r.addClass("sapMSPCMonthLnkMore");r.writeClasses();r.write(">");r.renderControl(o._getMoreLink(m,d,i));r.write("</div>");}r.write("<span");r.writeAttribute("id","fullDay-"+f.format(d.toLocalJSDate())+"-Descr");r.addClass("sapUiInvisibleText");r.writeClasses();r.write(">");r.write(o._getCellStartInfo(d.toLocalJSDate()));if(o._sLegendId&&L){r.writeEscaped(L);}r.write("</span>");r.write("</div>");};S.renderAppointments=function(r,o,d,e,m,D){var f=o._getMaxAppointments(),g=m?f-2:f-1;for(var i=0;i<d.length;i++){if(d[i].level<=g){this.renderAppointment(r,o,d[i],e,D);}}};S.renderAppointment=function(r,o,d,i,D){var A=d.data,w=d.width,l=d.level,e=o._getColumns(),t=A.getTooltip_AsString(),T=A.getType(),s=A.getColor(),f=A.getTitle(),g=A.getText(),h=A.getIcon(),j=A.getId(),m={role:"gridcell",labelledby:{value:I.getStaticId("sap.ui.unified","APPOINTMENT"),append:true},selected:A.getSelected()?true:false},R=e-i-w,k=b.getConfiguration().getRTL(),n,B=b.getConfiguration().getTheme().indexOf("_hc")?2:1;R=R<0?0:R;if(f){m["labelledby"].value=m["labelledby"].value+" "+j+"-Title";}m["labelledby"].value=m["labelledby"].value+" "+j+"-Descr";if(g){m["labelledby"].value=m["labelledby"].value+" "+j+"-Text";}if(A.getTentative()){m["labelledby"].value=m["labelledby"].value+" "+I.getStaticId("sap.ui.unified","APPOINTMENT_TENTATIVE");}r.write("<div");r.writeElementData(A);r.writeAttribute("data-sap-level",l);r.writeAttribute("data-sap-width",w);r.writeAttribute("tabindex",0);if(t){r.writeAttributeEscaped("title",t);}r.writeAccessibilityState(A,m);r.addClass("sapMSinglePCAppointmentWrap");r.addClass("sapUiCalendarRowApps");if(!s&&T!==c.None){r.addClass("sapUiCalendarApp"+T);}if(s){if(b.getConfiguration().getRTL()){r.addStyle("border-right-color",s);}else{r.addStyle("border-left-color",s);}}r.addStyle(k?"right":"left","calc("+(i*100)/e+"% + "+B+"px)");r.addStyle(k?"left":"right","calc("+(R*100)/e+"% + "+B+"px)");r.addStyle("top",(l*D.appHeight+D.cellHeaderHeight)+"rem");r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarApp");if(A.getSelected()){r.addClass("sapUiCalendarAppSel");}if(A.getTentative()){r.addClass("sapUiCalendarAppTent");}if(h){r.addClass("sapUiCalendarAppWithIcon");}r.writeClasses();r.writeStyles();r.write(">");r.write("<div");r.addClass("sapUiCalendarAppCont");if(s){r.addStyle("background-color",A._getCSSColorForBackground(s));r.writeStyles();}r.writeClasses();r.write(">");if(d.hasPrevious<0){n=["sapUiCalendarAppArrowIconLeft","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-left",n,{title:null});}if(h){n=["sapUiCalendarAppIcon"];var p={};p["id"]=j+"-Icon";p["title"]=null;r.writeIcon(h,n,p);}if(f){r.write("<span");r.writeAttribute("id",j+"-Title");r.addClass("sapUiCalendarAppTitle");r.writeClasses();r.write(">");r.writeEscaped(f,true);r.write("</span>");}if(d.hasNext<0){n=["sapUiCalendarAppArrowIconRight","sapUiCalendarAppArrowIcon"];r.writeIcon("sap-icon://arrow-right",n,{title:null});}r.write("<span id=\""+j+"-Descr\" class=\"sapUiInvisibleText\">"+o._getAppointmentAnnouncementInfo(A)+"</span>");r.write("</div>");r.write("</div>");r.write("</div>");};S.renderDayNames=function(r,o,l){var f=l.getFirstDayOfWeek(),s=o.getId(),d,e=b.getConfiguration().getCalendarType(),w=l.getDaysStandAlone("abbreviated",e),W=l.getDaysStandAlone("wide",e),D;r.write("<div id=\""+s+"-Names\" class='sapMSPCMonthDayNames'>");for(var i=0;i<7;i++){D=(i+f)%7;r.write("<div");r.addClass("sapUiCalWH");d=s+"-WH"+D;r.writeAttribute("id",d);if(i==0){r.addClass("sapUiCalFirstWDay");}r.writeAccessibilityState(null,{role:"columnheader",label:W[D]});r.writeClasses();r.writeStyles();r.write(">");r.write(w[D%7]);r.write("</div>");}r.write("</div>");};S.renderDndPlaceholder=function(r,p){r.write("<div class=\"sapMSinglePCOverlay\">");r.renderControl(p);r.write("</div>");};return S;},true);