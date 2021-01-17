CREATE TABLE IF NOT EXISTS lisa_state
(
    id                     INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,

    current_water          REAL                              NOT NULL,
    current_happiness      REAL                              NOT NULL,

    birth_timestamp        INTEGER                           NOT NULL,
    birth_initiator        TEXT                              NOT NULL,

    death_timestamp        INTEGER,
    death_initiator        TEXT,
    death_cause            TEXT,

    best_lifetime_duration INTEGER                           NOT NULL
)
