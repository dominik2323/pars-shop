"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var genCSV_1 = require("./genCSV");
var nodemailer = require('nodemailer');
function sendEmail(_a, database) {
    var company = _a.company, dic = _a.dic, email = _a.email, ico = _a.ico, items = _a.items, name = _a.name, note = _a.note, phone = _a.phone;
    return __awaiter(this, void 0, void 0, function () {
        var id, _b, shopItems, shopItemsVariants, transporter, markupRow, info;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = "NAB-" + Date.now();
                    _b = database.val(), shopItems = _b.shopItems, shopItemsVariants = _b.shopItemsVariants;
                    transporter = nodemailer.createTransport({
                        host: 'smtp.forpsi.com',
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'dominik.tomcik@steezy.studio',
                            pass: 'letsgetsteezy',
                        },
                        tls: {
                            rejectUnauthorized: false,
                        },
                    });
                    markupRow = function (name, value) { return "<p><b>" + name + ":\u2002</b>\n" + value + "</p>"; };
                    return [4 /*yield*/, transporter.sendMail({
                            from: "\"PARS SHOP\" <dominik.tomcik@steezy.studio>",
                            to: "dominik.tomcik23@gmail.com",
                            subject: "POPT\u00C1VKA PARS SHOP",
                            html: "\n        " + markupRow("Jm\u00E9no", name) + "\n        " + markupRow("Firma", company) + "\n        " + markupRow("E-mail", email) + "\n        " + markupRow("Telefon", phone) + "\n        " + markupRow("DI\u010C", dic) + "\n        " + markupRow("I\u010CO", ico) + "\n        " + markupRow("Pozn\u00E1mka", note) + "\n    ",
                            attachments: [
                                genCSV_1.genCSV([
                                    {
                                        CISLO_DOKLADU: id,
                                        DATUM: new Date().toLocaleString(),
                                        NAZEV: name,
                                        ADRESA: company,
                                        ICO: ico,
                                        DIC: dic,
                                        TELEFON: phone,
                                        EMAIL: email,
                                    },
                                ], id + '_hlavicka.csv'),
                                genCSV_1.genCSV(Object.keys(items).map(function (varioId) {
                                    var shopItemVariant = shopItemsVariants.data.find(function (x) { return x.varioId === varioId; });
                                    return {
                                        CISLO_DOKLADU: id,
                                        PRODUKT: shopItems.data.find(function (x) { return x.shopItemId === shopItemVariant.shopItemId; }).name,
                                        MNOZSTVI: items[varioId].no,
                                        JEDNOTKY: items[varioId].length,
                                        POPIS: shopItemVariant.dimensions,
                                        KATALOGOVE_CISLO: varioId,
                                    };
                                }), id + '_polozky.csv'),
                            ],
                        })];
                case 1:
                    info = _c.sent();
                    console.log("message send " + info.messageId);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendEmail = sendEmail;
