// auditlog.entity.ts
import { CustomBaseEntity } from '../../common/entities';
import { DecimalColumnTransformer } from '../../common/decimal-column-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class AuditLog extends CustomBaseEntity {
  @Column({ nullable: true, comment: 'The action that triggered this log' })
  action: string;

  @Column({ nullable: true, comment: 'Description of the action performed' })
  description: string;

  @Column({ type: 'timestamp', nullable: true, comment: 'Timestamp of the action' })
  timestamp: Date;
  
  @Column({ type: 'numeric', transformer: new DecimalColumnTransformer(), nullable: true, comment: 'The previous credit value before the action' })
  previousCredit: number;

  @Column({ type: 'numeric', transformer: new DecimalColumnTransformer(), nullable: true, comment: 'The previous limit credit value before the action' })
  previousLimitCredit: number;

  @ManyToOne(() => User, (_) => _.auditLogs)
  user: User;
  
  @Column({ nullable: true, comment: 'The ID of the user who performed the action' })
  userId: number;
}
