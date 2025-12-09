const URL_PLATOS = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=0&single=true&output=csv";
const URL_ING    = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=688098548&single=true&output=csv";
const URL_PASOS  = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQUhilXj9P1Kh1JrpnSJLCT0TM_XBpMM-d3fbw17RREop6Jcz73U_aqmgM-dL5EO8T5Tr_8qG_RgUrx/pub?gid=1382429978&single=true&output=csv";

async function csv(url){
  const t=await (await fetch(url)).text();
  const rows=t.split("\n").map(r=>r.split(","));
  const head=rows.shift();
  return rows.map(r=>Object.fromEntries(r.map((v,i)=>[head[i],v.trim()])));
}

let PLATOS=[],ING=[],PASOS=[];

async function init(){
  PLATOS=await csv(URL_PLATOS);
  ING=await csv(URL_ING);
  PASOS=await csv(URL_PASOS);
  renderMeals();
}
init();

function renderMeals(){
  let html="";
  PLATOS.forEach(p=>{
    html+=`
    <div class="card" onclick="openRecipe('${p.codigo}')">
      <img src="assets/img/${p.imagen_archivo||p.codigo+'.jpg'}">
      <div class="card-body">
        <h3>${p.nombre_plato}</h3>
        <p>${p["tiempo_preparacion(min)"]} min • ${p.porciones} porciones</p>
        <button>Ver receta</button>
      </div>
    </div>`;
  });
  gallery.innerHTML=html;
}

function openRecipe(id){
  const r=PLATOS.find(p=>p.codigo===id);
  modalName.textContent=r.nombre_plato;
  modalTime.textContent=r["tiempo_preparacion(min)"]+" min";
  modalPortions.textContent=r.porciones+" porciones";

  modalImg.src="assets/img/"+(r.imagen_archivo||r.codigo+".jpg");

  modalIngredients.innerHTML=ING
    .filter(i=>i.codigo_plato===id)
    .map(i=>`<li>${i.ingrediente} — ${i.cantidad||"-"}</li>`).join("");

  modalSteps.innerHTML=PASOS
    .filter(s=>s.codigo===id)
    .sort((a,b)=>a.orden-b.orden)
    .map(s=>`<li>${s.indicacion}</li>`).join("");

  recipeModal.style.display="flex";
}

function closeRecipe(){
  recipeModal.style.display="none";
}
