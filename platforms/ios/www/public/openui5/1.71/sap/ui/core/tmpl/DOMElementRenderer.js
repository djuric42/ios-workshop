/*!
 * OpenUI5
 * (c) Copyright 2009-2019 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/base/security/encodeXML"],function(e){"use strict";var D={};var r=/^(?:area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/i;D.render=function(R,E){R.write("<");R.writeEscaped(E.getTag());R.writeControlData(E);E.getAttributes().forEach(function(A){var n=A.getName().toLowerCase();if(n==="class"){var c=A.getValue().split(" ");c.forEach(function(C){var C=C.trim();if(C){R.addClass(e(C));}});}else if(n==="style"){var s=A.getValue().split(";");s.forEach(function(S){var i=S.indexOf(":");if(i!=-1){var k=S.substring(0,i).trim();var v=S.substring(i+1).trim();R.addStyle(e(k),e(v));}});}else{R.writeAttributeEscaped(e(A.getName()),A.getValue());}});R.writeClasses();R.writeStyles();var a=E.getElements(),h=!!E.getText()||a.length>0;R.write(">");if(h){if(E.getText()){R.writeEscaped(E.getText());}a.forEach(function(i,c){R.renderControl(c);});}if(!r.test(E.getTag())){R.write("</");R.writeEscaped(E.getTag());R.write(">");}};return D;},true);
