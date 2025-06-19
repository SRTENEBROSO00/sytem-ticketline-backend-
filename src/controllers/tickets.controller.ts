import { Request, Response } from "express";
import { Ticket } from "./../entity/Ticket";
import { AppDataSource } from "../data-source";

// Ahora toca hacer
export class TicketController {
  
  //Get repository
  private ticketRepo = AppDataSource.getRepository(Ticket); //Preapre repo

  //Business logic (CRUD)
  async createTicket(req: Request, res: Response): Promise<void> {
    //Estos tickets son independientes de los usuarios o técnicos
    try {
      const {
        clientName,
        phoneNumber,
        address,
        contracts,
        descriptionIssue,
        status,
        assignedTechnician,
        technicalDescripction,
        creationDate,
        solveDate,
        softDelete
      } = req.body;

      const requiredFields = {
        clientName,
        phoneNumber,
        address,
        contracts,
        descriptionIssue,
        status,
        assignedTechnician
      }
      const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

      if (missingFields.length > 0) {
        res.status(400).json({ message: "Required fields." });
        return;
      }

      // Recuperar y preparar los datos a crear
      const newTicket = this.ticketRepo.create({
        clientName: clientName,
        phoneNumber: phoneNumber,
        address: address,
        contracts: contracts,
        descriptionIssue: descriptionIssue,
        status: status,
        assignedTechnician: assignedTechnician,
        technicalDescripction,
        creationDate: new Date(),
        solveDate,
        softDelete: softDelete
      });

      // Guardar los datos
      await this.ticketRepo.save(newTicket);

      res.status(200).json({ message: "✔ Data saved" });
    } catch (error) {
      res.status(500).json({ message: `Error creating data: ${error}` });
    }
  }

  async getAllTicket(_req: Request, res: Response): Promise<any> {
    try {
      const getTickets = await this.ticketRepo.find({
        relations: [],
      });
      if (!getTickets || getTickets.length == 0) {
        return res.status(404).json({message: 'Data no found.'});
      }

      res.status(200).json(getTickets);
    } catch (error) {
      res.status(500).json({ message: `Error getting data: ${error}` });
    }
  }

  async getTicketById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      //hacer la consulta
      const resTicketID = await this.ticketRepo.findOne({
        where: { id },
      });
      if (!resTicketID) {
        res.status(404).json({ message: "Ticket no found." });
        return;
      }
      res.status(200).json(resTicketID);
    } catch (error) {
      res.status(500).json({ message: `Error getting ID ticket: ${error}` });
    }
  }
 
  async updateTicketById(req: Request, res: Response): Promise<void> {
    try {
      const {
        clientName,
        phoneNumber,
        address,
        contracts,
        descriptionIssue,
        status,
        assignedTechnician,
        technicalDescripction,
        creationDate,
        solveDate,
        softDelete
      } = req.body;
      const {id} = req.params

      const resTicketToUpdate = await this.ticketRepo.findOne({
        where: {id}
      }) 

      if(!resTicketToUpdate) {
        res.status(404).json({message: 'Ticket no found'});
        return;
      } 
      
      if(resTicketToUpdate && clientName) resTicketToUpdate.clientName = clientName;
      if(resTicketToUpdate && phoneNumber) resTicketToUpdate.phoneNumber = phoneNumber;
      if(resTicketToUpdate && address) resTicketToUpdate.address = address;
      if(resTicketToUpdate && contracts) resTicketToUpdate.contracts = contracts;
      if(resTicketToUpdate && descriptionIssue) resTicketToUpdate.descriptionIssue = descriptionIssue;
      if(resTicketToUpdate && status) resTicketToUpdate.status = status;
      if(resTicketToUpdate && assignedTechnician) resTicketToUpdate.assignedTechnician = assignedTechnician;
      if(resTicketToUpdate && technicalDescripction) resTicketToUpdate.technicalDescripction = technicalDescripction;
      if(resTicketToUpdate && creationDate) resTicketToUpdate.creationDate = creationDate;
      if(resTicketToUpdate && solveDate) resTicketToUpdate.solveDate = solveDate;
      if(resTicketToUpdate && softDelete) resTicketToUpdate.softDelete = softDelete;

      // Save
      const saveTicketUpdated = await this.ticketRepo.save(resTicketToUpdate)
      
      res.json({message: ' ✔ Ticket updated successfully', ticket: saveTicketUpdated})
    } catch (error) {
      res.status(500).json({ message: `Error updating tickets: ${error}` });
    }
  }

  async deleteTicket(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const resTicketDelID = await this.ticketRepo.findOneBy({ id });

      if (!resTicketDelID) {
        return res.status(404).json({ messaje: "Ticket no found." });
      };
      
      resTicketDelID.softDelete = true;
      console.log(resTicketDelID.softDelete);

      const result = await this.ticketRepo.save(resTicketDelID);
      res.status(200).json({message: `✔ Ticket deleted successfully`, ticket: result})
    } catch (error) {
      res.status(500).json({ message: `Error deleting ticket: ${error}` });
    };
  };
};
