import { createStore } from 'vuex'
import { collection, query, getDocs, deleteDoc,doc,updateDoc  } from "firebase/firestore";
import {db} from '../firebase/firebaseInit'
const q = query(collection(db, "invoices"));
export default createStore({
  state: {
    invoiceData:[],
    invoiceModal:null,
    modalActive:null,
    invoicesLoaded: null,
    currentInvoiceArray:null,
    editInvoice:null

  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state){
      state.modalActive=!state.modalActive
    },
    SET_INVOICE_DATA(state,payload){
      state.invoiceData.push(payload);
      console.log(state.invoiceData);
    },
    INVOICES_LOADED(state){
     state.invoicesLoaded=true
    },
    //this mutation selects data from our invoiceData that 
    //corresponds to the invoiceId that we shall pick from HomeView
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload;
      });
    },
    //the code to edit an invoice
    TOGGLE_EDIT_INVOICE(state){
    state.editInvoice = !state.editInvoice
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter((invoice) => invoice.docId !== payload);
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },

  },
  actions: {
    async GET_INVOICES({ commit, state }) {
   const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            if(!state.invoiceData.some(invoice=>invoice.docId===doc.id)){
              const data = {
                docId: doc.id,
                invoiceId: doc.data().invoiceId,
                billerStreetAddress: doc.data().billerStreetAddress,
                billerCity: doc.data().billerCity,
                billerZipCode: doc.data().billerZipCode,
                billerCountry: doc.data().billerCountry,
                clientName: doc.data().clientName,
                clientEmail: doc.data().clientEmail,
                clientStreetAddress: doc.data().clientStreetAddress,
                clientCity: doc.data().clientCity,
                clientZipCode: doc.data().clientZipCode,
                clientCountry: doc.data().clientCountry,
                invoiceDateUnix: doc.data().invoiceDateUnix,
                invoiceDate: doc.data().invoiceDate,
                paymentTerms: doc.data().paymentTerms,
                paymentDueDateUnix: doc.data().paymentDueDateUnix,
                paymentDueDate: doc.data().paymentDueDate,
                productDescription: doc.data().productDescription,
                invoiceItemList: doc.data().invoiceItemList,
                invoiceTotal: doc.data().invoiceTotal,
                invoicePending: doc.data().invoicePending,
                invoiceDraft: doc.data().invoiceDraft,
                invoicePaid: doc.data().invoicePaid,
              };
              commit("SET_INVOICE_DATA", data);
            }
      
        //console.log(doc.id, " => ", doc.data());
        
      });
     
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({commit},docId){
      await deleteDoc(doc(db, "invoices", docId));
     commit("DELETE_INVOICE",docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      const getInvoice = doc(db, "invoices", docId);
      await updateDoc(getInvoice, {
        invoicePaid: true,
        invoicePending: false,
      });
    
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      const getInvoice = doc(db, "invoices", docId);
      await updateDoc(getInvoice, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
    
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
 },
  modules: {}
})
