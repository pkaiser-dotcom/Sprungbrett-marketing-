// src/entities/Customer.js
import { makeEntity } from "@/integrations/Core";

export const Customer = makeEntity("Customer");
// danach sind verfügbar: Customer.list(), Customer.create(), Customer.update(), Customer.delete()

export default Customer;
