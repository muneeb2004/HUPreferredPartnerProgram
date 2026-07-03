CREATE INDEX idx_partner_search ON "partners" USING GIN (to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, '')));
CREATE INDEX idx_offer_search ON "offers" USING GIN (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));
