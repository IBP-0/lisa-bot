export const TYPES = {
	TimeProvider: Symbol.for("TimeProvider"),

	PersistenceProvider: Symbol.for("PersistenceProvider"),
	StateRepository: Symbol.for("StateRepository"),
	StorageController: Symbol.for("StorageController"),

	StatusService: Symbol.for("StatusService"),
	StatusTextService: Symbol.for("StatusTextService"),

	StateController: Symbol.for("StateController"),
	TickController: Symbol.for("TickController"),

	DiscordService: Symbol.for("DiscordService"),

	DiscordCommandController: Symbol.for("DiscordCommandController"),
	DiscordEventController: Symbol.for("DiscordEventController"),
	DiscordClient: Symbol.for("DiscordClient"),

	DiscordConfig: Symbol.for("DiscordConfig"),
};
