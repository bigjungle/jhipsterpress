import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JhiAlertService } from 'ng-jhipster';

import { ITopic } from 'app/shared/model/topic.model';
import { TopicService } from './topic.service';
import { IPost } from 'app/shared/model/post.model';
import { PostService } from 'app/entities/post';

@Component({
    selector: 'jhi-topic-update',
    templateUrl: './topic-update.component.html'
})
export class TopicUpdateComponent implements OnInit {
    topic: ITopic;
    isSaving: boolean;

    posts: IPost[];

    nameParamPost: any;
    valueParamPost: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private topicService: TopicService,
        private postService: PostService,
        private activatedRoute: ActivatedRoute
    ) {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.postIdEquals != null) {
                this.nameParamPost = 'postId.equals';
                this.valueParamPost = params.postIdEquals;
            }
            console.log('CONSOLOG: M:constructor & O: activatedRoute : ', this.nameParamPost, ' : ', this.valueParamPost);
        });
    }

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ topic }) => {
            this.topic = topic;
        });
        if (this.valueParamPost != null) {
            const query = {};
            query['id.equals'] = this.valueParamPost;
            this.postService.query(query).subscribe(
                (res: HttpResponse<IPost[]>) => {
                    this.posts = res.body;
                    console.log('CONSOLOG: M:ngOnInit & O: this.posts if1 : ', this.posts);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        } else {
            this.postService.query().subscribe(
                (res: HttpResponse<IPost[]>) => {
                    this.posts = res.body;
                    console.log('CONSOLOG: M:ngOnInit & O: this.posts else2 : ', this.posts);
                },
                (res: HttpErrorResponse) => this.onError(res.message)
            );
        }
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.topic.id !== undefined) {
            this.subscribeToSaveResponse(this.topicService.update(this.topic));
        } else {
            this.subscribeToSaveResponse(this.topicService.create(this.topic));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITopic>>) {
        result.subscribe((res: HttpResponse<ITopic>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackPostById(index: number, item: IPost) {
        return item.id;
    }

    getSelected(selectedVals: Array<any>, option: any) {
        if (selectedVals) {
            for (let i = 0; i < selectedVals.length; i++) {
                if (option.id === selectedVals[i].id) {
                    return selectedVals[i];
                }
            }
        }
        return option;
    }
}
