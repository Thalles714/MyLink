import './styles.css';
import './mascot.css';
import { projectIcon } from './icons.js';

(()=>{
const data={
professional:{title:'Profissional',subtitle:'Meu estúdio, código e trajetória',links:[
['S','Sifego Studio','Meu estúdio de soluções digitais','https://sifego.studio/'],
['S↗','Sifego · Demo','Demonstração pública','https://demo.sifego.studio/'],
['GH','GitHub','Repositórios, código e experimentos','https://github.com/Thalles714'],
['in','LinkedIn','Trajetória e contexto profissional','https://www.linkedin.com/in/thalles-leal-tavares-9b0404294/']]},
personal:{title:'Projetos pessoais',subtitle:'Um espaço para construir e experimentar',links:[
['TL','Portfólio pessoal','Uma visão geral do meu trabalho','https://portifoliothallesleal.vercel.app/#home'],
['W','Workflow','Gestão de projetos · Demo de portfólio','https://workflow-app-lac.vercel.app/demo'],
['N','Nítido','Organização financeira · Projeto independente','https://nitido.thallestleal.workers.dev/']]},
freelance:{title:'Freelas',subtitle:'Projetos realizados para clientes',links:[
['VA','Clínica Voe Alto','Landing page','https://clinicavoealto.com.br/'],
['GS','Good Sollar','Landing page','https://www.goodsollar.com.br/'],
['SM','Snow Mídia · Liberdade Financeira','Captação de leads + tráfego pago no Meta Ads','https://snowmidia.com.br/liberdade-financeira-total'],
['SM','Snow Mídia · Hotéis e Pousadas','Captação de leads + tráfego pago no Meta Ads','https://snowmidia.com.br/hoteis-e-pousadas'],
['AR','A.R Vazamentos','Fluxo de captação de leads + Google Ads','https://arvazamento.com.br/'],
['OPN','OPN','Dashboard de campanhas Meta Ads','https://opn-meta-ads-dashboard.vercel.app/'],
['IP','IdlePoke','Dashboard + gestão de tráfego pago no Meta Ads','https://idlepoke-meta-ads-dashboard.vercel.app/']]}
};
const dialog=document.querySelector('dialog');const list=document.getElementById('project-list');let opener;
document.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{
opener=button;const group=data[button.dataset.open];document.getElementById('dialog-title').textContent=group.title;document.getElementById('dialog-subtitle').textContent=group.subtitle;
list.replaceChildren(...group.links.map(([icon,name,description,url])=>{
const a=document.createElement('a');a.className='project';a.href=url;a.target='_blank';a.rel='noopener noreferrer';const symbol=document.createElement('span');symbol.className='project-icon';symbol.innerHTML=projectIcon(name);symbol.setAttribute('aria-hidden','true');const copy=document.createElement('span');copy.className='project-copy';const title=document.createElement('span');title.className='project-name';title.textContent=name;const desc=document.createElement('span');desc.className='project-desc';desc.textContent=description;copy.append(title,desc);a.append(symbol,copy);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width','16');svg.setAttribute('height','16');svg.setAttribute('aria-hidden','true');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#arrow');svg.append(use);a.append(svg);return a;
}));dialog.showModal();document.body.style.overflow='hidden';
}));
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close()}});dialog.addEventListener('close',()=>{document.body.style.overflow='';opener?.focus()});
const reduced=matchMedia('(prefers-reduced-motion: reduce)');const fine=matchMedia('(pointer:fine)');
document.querySelectorAll('.card').forEach(card=>{let frame=0,x=0,y=0;function reset(){cancelAnimationFrame(frame);frame=0;card.style.transform='';card.style.removeProperty('--px');card.style.removeProperty('--py')}
card.addEventListener('pointermove',event=>{if(reduced.matches||!fine.matches)return;const r=card.getBoundingClientRect();x=(event.clientX-r.left)/r.width-.5;y=(event.clientY-r.top)/r.height-.5;if(!frame)frame=requestAnimationFrame(()=>{frame=0;card.style.transform=`perspective(1100px) rotateX(${-y*3}deg) rotateY(${x*3}deg) translateY(-3px)`;card.style.setProperty('--px',`${x*8}px`);card.style.setProperty('--py',`${y*6}px`)});});card.addEventListener('pointerleave',reset);card.addEventListener('blur',reset);reduced.addEventListener('change',reset);
});
})();

import('./mascot.js').then(({ initMascot }) => initMascot());