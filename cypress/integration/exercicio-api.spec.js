/// <reference types="cypress" />
import contrato from '../contracts/usuarios.contract'
describe('Testes da Funcionalidade Usuários', () => {
     let token
     before (()=> {
          cy.token ('fulano@qa.com', 'teste').then(tkn =>{
               token = tkn
          })

     })
    it('Deve validar contrato de usuários', () => {
         cy.request ('usuarios').then(response =>{
          return contrato.validateAsync(response.body)

         }) 
    });

    it('Deve listar usuários cadastrados', () => {
         cy.request ({
          method: 'GET',
          url:'usuarios'
         }).then(response =>{
          expect (response.status).to.equal(200)
          expect (response.body).to.have.property('quantidade')
          expect (response.body).to.have.property('usuarios')
          expect (response.body.usuarios[0]).to.have.property('nome')
          expect (response.body.usuarios[0]).to.have.property('email')
          expect (response.body.usuarios[0]).to.have.property('password')
          expect (response.body.usuarios[0]).to.have.property('administrador')
          expect (response.body.usuarios[0]).to.have.property('_id')
          
     })
    });

    it('Deve cadastrar um usuário com sucesso', () => {
          let email =`Aline${Math.floor(Math.random()*10000000)}@gmail.com`
         cy.cadastrarUsuario(token, 'Teste', email, '1234', 'true').then(response =>{
          expect (response.status).to.equal(201)
          expect (response.body.message).to.equal('Cadastro realizado com sucesso')

         })
    });

    it('Deve validar um usuário com email inválido', () => {
     cy.cadastrarUsuario(token, 'QA', 'qa.com.br', '4321', 'false').then(response =>{
          expect (response.status).to.equal(400)
          expect (response.body.email).to.equal('email deve ser um email válido')

         })
    });

    it('Deve editar um usuário previamente cadastrado', () => {
     let email =`Aline${Math.floor(Math.random()*10000000)}@gmail.com`
     cy.cadastrarUsuario(token, 'Processo', email, '4321', 'false').then(response =>{
       let id= response.body._id
       cy.request({
          method: "PUT", 
          url: `usuarios/${id}`, 
          headers:{authorization:token},
          body: {
               "nome": 'JGT',
               "email": email,
               "password": "123456",
               "administrador": 'true'
                                  }, 
                                  failOnStatusCode: false
       }).then (response =>{
          expect (response.status).to.equal(200)
          expect (response.body.message).to.equal('Registro alterado com sucesso') 
       })
     })
     }); 

    it('Deve deletar um usuário previamente cadastrado', () => {
     let email =`Aline${Math.floor(Math.random()*10000000)}@gmail.com`
     cy.cadastrarUsuario(token, 'Qualidade', email, '4321', 'false').then(response =>{
       let id= response.body._id
       cy.request({
          method: "DELETE", 
          url: `usuarios/${id}`, 
          headers:{authorization:token},
          failOnStatusCode: false
       }).then (response =>{
          expect (response.status).to.equal(200)
          expect (response.body.message).to.equal('Registro ecluído com sucesso') 
       })
     })
    });


});
