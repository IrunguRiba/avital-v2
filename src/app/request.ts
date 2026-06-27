export interface IUserRequest {
    firstName?: string; 
    lastName?: string; 
    email: string;     
    phoneNumber: string; 
    institution: 'University' | 'College' | 'TTI' | 'ANY OTHER';
    service: 'Proposal / Brainstorming' | 'Project' | 'Any Other';
    requestStatus: 'In Progress' | 'Completed'; 
    createdAt: Date;   
    updatedAt: Date;    
  }